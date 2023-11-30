from decimal import *
from datetime import datetime

class View():
    def inicio(self):
        return self.menu()

    def menu(self):
        print("M E N U")
        print("1. Rodar API")
        print("2. Sair")
        opcao = int(input("Digite a opcao desejada : "))
        return opcao


