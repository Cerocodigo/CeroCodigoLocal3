
import mysql.connector


class class_mysql:
    def __init__(self, v_user, v_password, v_data_base, v_ip, v_port):
        self.c_user = v_user
        self.c_password = v_password
        self.c_data_base = v_data_base
        self.c_ip = v_ip
        self.c_port = v_port
    def ejecutar_varios(self, sentence):
        db  = mysql.connector.connect(host=self.c_ip, user=self.c_user, passwd=self.c_password, db=self.c_data_base, charset='utf8', port=self.c_port)
        cur = db.cursor()
        aaa = 0
        sentemala = ''
        try:
            for sent in sentence:
                sentemala = sent
                cur.execute(sent.replace('�',''))
                aaa = aaa +1
                db.commit()
        except TimeoutError:
            pass
        except:
            pass
        db.close()
    def ejecutar(self, sentence):
        db  = mysql.connector.connect(host=self.c_ip, user=self.c_user, passwd=self.c_password, db=self.c_data_base, charset='utf8')
        cur = db.cursor()
        try:
           cur.execute(sentence)
           db.commit()
        except:
           db.rollback()
        db.close()
    def table_utf8(self, sentence):
        db  = mysql.connector.connect(host=self.c_ip, user=self.c_user, passwd=self.c_password, db=self.c_data_base, charset='utf8')
        cur = db.cursor()
        cur.execute(sentence)
        return dictfetchall(cur)
        db.close()
    def table(self, sentence):
        db  = mysql.connector.connect(host=self.c_ip, user=self.c_user, passwd=self.c_password, db=self.c_data_base, charset='utf8')
        cur = db.cursor()
        cur.execute(sentence)
        return dictfetchall(cur)
        db.close()
    def table_orden(self, sentence):
        db  = mysql.connector.connect(host=self.c_ip, user=self.c_user, passwd=self.c_password, db=self.c_data_base, charset='utf8')
        cur = db.cursor()
        cur.execute(sentence)        
        dictlist = cur.fetchall()
        names =  cur.description
        para_retor = []
        for tt in dictlist:
            fila = {}
            indx = 0
            for yy in names:
                fila[yy[0]] = tt[indx] 
                indx = indx + 1
            para_retor.append(fila)
        return para_retor
        db.close()

    def como_cursor(self, sentence):
        db  = mysql.connector.connect(host=self.c_ip, user=self.c_user, passwd=self.c_password, db=self.c_data_base, charset='utf8')
        cur = db.cursor()
        cur.execute(sentence)
        para_retornar = [cur.description, cur.fetchall() ]
        return para_retornar         
        db.close()  

    def cursor_tabla(self, sentence):
        db  = mysql.connector.connect(host=self.c_ip, user=self.c_user, passwd=self.c_password, db=self.c_data_base, charset='utf8')
        cur = db.cursor()
        cur.execute(sentence)        
        dictlist = cur.fetchall()
        names =  cur.description
        return [names, dictlist]
        db.close()

    def diccionario(self, sentence):
        db  = mysql.connector.connect(host=self.c_ip, user=self.c_user, passwd=self.c_password, db=self.c_data_base, charset='utf8')
        cur = db.cursor()
        cur.execute(sentence)        
        dictlist = cur.fetchall()
        names =  cur.description
        return [names, dictlist]
        db.close()





def dictfetchall(cursor):
        "Returns all rows from a cursor as a dict"
        desc = cursor.description
        return [
    	   dict(zip([col[0] for col in desc], row))
    	   for row in cursor.fetchall()
        ]

        try:
           cur.execute(sentence)
           db.commit()
        except:
           db.rollback()
        db.close()

class class_mysql_trass:
    def __init__(self, v_user, v_password, v_data_base, v_ip, v_port  ):
        self.c_user = v_user
        self.c_password = v_password
        self.c_data_base = v_data_base
        self.c_ip = v_ip
    def empiza(self):
        self.db  = mysql.connector.connect(host=self.c_ip, user=self.c_user, passwd=self.c_password, db=self.c_data_base, charset='utf8')
        self.cur = self.db.cursor()

    def rollback(self):
        self.db.rollback() 
        self.db.close()

    def commit(self):
        self.db.commit() 
        self.db.close()

    def ejecutar(self, sentence):
        try:
           self.cur.execute(sentence)
        except:
           return False
        return True

    def table(self, sentence):
        self.cur.execute(sentence)
        return dictfetchall(self.cur)

    def como_cursor(self, sentence):
        self.cur.execute(sentence)
        para_retornar = [self.cur.description, self.cur.fetchall() ]
        return para_retornar         
        
    def cursor_tabla(self, sentence):
        self.cur.execute(sentence)        
        dictlist = self.cur.fetchall()
        names =  self.cur.description
        return [names, dictlist]

    def diccionario(self, sentence):
        self.cur.execute(sentence)        
        dictlist = self.cur.fetchall()
        names =  self.cur.description
        return [names, dictlist]


