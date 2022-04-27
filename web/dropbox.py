from http import client
#import dropbox

class dropbox_class:
    def __init__(self,V_access_token, V_path):
        self.dropbox_access_token= V_access_token    #Enter your own access token
        self.dropbox_path= V_path # "/Cat Watching Test/cat1.jpg"
        self.client = dropbox.Dropbox(V_access_token)

    def link(self):
        print("[SUCCESS] dropbox account linked")
    
    def subir(self, linky):
        self.client.files_upload(open(linky, "rb").read(), self.dropbox_path)
        print("[UPLOADED] {}".format(linky))

    def subirdirecto(self, file):
        self.client.files_upload(file.read(), self.dropbox_path)
        print("[UPLOADED] {}")

