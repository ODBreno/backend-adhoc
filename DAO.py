from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
from mapeamento import *
import logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

class DAO():
    def getSession():
        engine = create_engine("postgresql+psycopg2://postgres:admin@localhost:5432/trabalho_bd2", echo=True) #200.235.88.87
        Session = sessionmaker(bind=engine)
        session = Session()
        return session
