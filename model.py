from flask import Flask, jsonify, request
from sqlalchemy import and_, or_
import sqlalchemy
from DAO import *
from mapeamento import *
from flask_cors import CORS
from sqlalchemy.orm import class_mapper


class AcessDB:
    @staticmethod
    def consulta(select, join, where, operators, values, condition, order_by, func_agregada, group_by):
        session = DAO.getSession()
        # Build the base query
        query = session.query()
        tables = []

        # Add tables to the query
        if join:
            for table in join:
                tables.append(globals()[''.join(word.capitalize() for word in table.split('_'))])  # Assuming table names match class names

        query = query.select_from(tables[0])

        # Add dynamic join conditions
        for i in range(len(tables) - 1):
            join_condition = AcessDB.build_join_condition(tables[i], tables[i + 1])
            query = query.join(tables[i + 1], join_condition)

        # Add columns to the query
        for table, cols in select.items():
            table_obj = globals()[table.capitalize()]  # Assuming table names match class names
            for col in cols:
                if len(join) > 1:
                    query = query.add_column(getattr(table_obj, col).label(str(table) + '_' + str(col)))
                else:
                    query = query.add_column(getattr(table_obj, col))

        # Add conditions to the query
        conditions = []
        if where:
            for table, cols in where.items():
                table_obj = globals()[table.capitalize()]  # Assuming table names match class names
                for i, col in enumerate(cols):
                    if values[table][i] is not None:
                        if operators[table][i] is not None:
                            conditions.append(*AcessDB.build_where_condition(table_obj, [col], [operators[table][i]], [values[table][i]]))

            if condition == "OR":
                query = query.filter(or_(*conditions))
            elif condition == "AND":
                query = query.filter(and_(*conditions))
            else:
                query = query.filter(*conditions)
            
        # Add order by to the query
        if order_by:
            for table, order in order_by.items():
                table_obj = globals()[table.capitalize()]  # Assuming table names match class names
                query = query.order_by(getattr(table_obj, order[0]).asc() if order[1] == "ASC" else getattr(table_obj, order[0]).desc())
        
        # Funções Agregadas
        if func_agregada:
            for table, funcs in func_agregada.items():
                table_obj = globals()[table.capitalize()]  # Assuming table names match class names
                # Adicione a função agregada ao resultado
                if funcs[1] == "COUNT":
                    query = query.add_column(func.count(getattr(table_obj, funcs[0])).label("count_" + funcs[0] + "_" + table))
                elif funcs[1] == "SUM":
                    column = getattr(table_obj, funcs[0])
                    if not isinstance(column.type, (sqlalchemy.Integer, sqlalchemy.Float)):
                        raise ValueError(f"Coluna {funcs[0]} da tabela {table} deve ser de algum tipo numérico para calcular a média!")
                    query = query.add_column(func.cast(func.sum(column), Numeric(12, 2)).label("sum_" + funcs[0] + "_" + table))
                elif funcs[1] == "MIN":
                    column = getattr(table_obj, funcs[0])
                    if not isinstance(column.type, (sqlalchemy.Integer, sqlalchemy.Float)):
                        raise ValueError(f"Coluna {funcs[0]} da tabela {table} deve ser de algum tipo numérico para calcular o mínimo!")
                    query = query.add_column(func.min(column).label("min_" + funcs[0] + "_" + table))
                elif funcs[1] == "MAX":
                    column = getattr(table_obj, funcs[0])
                    if not isinstance(column.type, (sqlalchemy.Integer, sqlalchemy.Float)):
                        raise ValueError(f"Coluna {funcs[0]} da tabela {table} deve ser de algum tipo numérico para calcular o máximo!")
                    query = query.add_column(func.max(column).label("max_" + funcs[0] + "_" + table))

        # Adicione a cláusula GROUP BY para funções de agregação
        if group_by:
            group_by_column = getattr(tables[0], next(iter(select.items()))[1][0])
            query = query.group_by(group_by_column)

        return query.all()
    
    @staticmethod
    def build_join_condition(table1, table2):
        # Verifique se há uma relação direta entre as tabelas
        for relationship in class_mapper(table1).relationships:
            if relationship.target == table2:
                return getattr(table1, relationship.key) == getattr(table2, relationship.back_populates)

        # Verifique se é uma tabela de associação
        for assoc_table in Base.metadata.tables.values():
            if (
                table1.__table__ in assoc_table.foreign_key_constraints
                and table2.__table__ in assoc_table.foreign_key_constraints
            ):
                # Adicione condições específicas para tabelas de associação
                if assoc_table.name == 'deputado_orgao':
                    return and_(
                        table1.id == assoc_table.c.id_deputado,
                        table2.id == assoc_table.c.id_orgao
                    )
                elif assoc_table.name == 'evento_deputado':
                    return and_(
                        table1.id == assoc_table.c.id_deputado,
                        table2.id == assoc_table.c.id_evento
                    )
                elif assoc_table.name == 'evento_orgao':
                    return and_(
                        table1.id == assoc_table.c.id_orgao,
                        table2.id == assoc_table.c.id_evento
                    )

    @staticmethod
    def build_where_condition(table, columns, operators, values):
        conditions = []

        for i, col in enumerate(columns):
            if values[i] is not None:
                if operators[i] == "=":
                    conditions.append(getattr(table, col) == values[i])
                elif operators[i] == ">":
                    conditions.append(getattr(table, col) > values[i])
                elif operators[i] == ">":
                    conditions.append(getattr(table, col) > values[i])
                elif operators[i] == "<":
                    conditions.append(getattr(table, col) < values[i])
                elif operators[i] == ">=":
                    conditions.append(getattr(table, col) >= values[i])
                elif operators[i] == "<=":
                    conditions.append(getattr(table, col) <= values[i])
                elif operators[i].lower() == "ilike":
                    conditions.append(func.lower(getattr(table, col)).ilike(f"%{values[i].lower()}%"))
                elif operators[i].lower() == "like":
                    conditions.append(getattr(table, col).like(f"%{values[i]}%"))

        return conditions if conditions else None


class API:
    def __init__(self):
        self.db = AcessDB()
        self.app = Flask(__name__)
        CORS(self.app)
        self.app.route('/query', methods=['POST'])(self.get_consulta)
        self.app.run(host = '0.0.0.0')

    def run(self):
        self.app.run(debug=True)

    def get_consulta(self):
        body = request.get_json()
        resultados = self.db.consulta(
            body.get("select"),
            body.get("join"),
            body.get("where"),
            body.get("operators"),
            body.get("values"),
            body.get("condition"),
            body.get("order_by"),
            body.get("func_agregada"),
            body.get("group_by")
        )

        result_dicts = [row._asdict() for row in resultados]
        return jsonify(result_dicts)
