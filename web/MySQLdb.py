
import MySQLdb


class class_mysql:
    def __init__(self, v_user, v_password, v_data_base, v_ip  ):
        self.c_user = v_user
        self.c_password = v_password
        self.c_data_base = v_data_base
        self.c_ip = v_ip
        

    def ejecutar(self, sentence):
        print(sentence)
        db = MySQLdb.connect(self.c_ip,self.c_user,self.c_password,self.c_data_base )
        cur = db.cursor()
        try:
           cur.execute(sentence)
           db.commit()
        except:
           db.rollback()
        db.close()

    def table(self, sentence):
        db = MySQLdb.connect(self.c_ip,self.c_user,self.c_password,self.c_data_base )
        cur = db.cursor()
        cur.execute(sentence)
        return dictfetchall(cur)
        db.close()

    def como_cursor(self, sentence):
        db = MySQLdb.connect(self.c_ip,self.c_user,self.c_password,self.c_data_base )
        cur = db.cursor()
        cur.execute(sentence)
        para_retornar = [cur.description, cur.fetchall() ]
        return para_retornar
         
        db.close()     
        
def dictfetchall(cursor):
        "Returns all rows from a cursor as a dict"
        desc = cursor.description
        return [
    	   dict(zip([col[0] for col in desc], row))
    	   for row in cursor.fetchall()
        ]

