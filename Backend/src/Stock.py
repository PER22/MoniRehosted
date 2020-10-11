class Stock:
    label = ""
    data = []


    def __init__(self, new_label):
        self.label = new_label

    def toString(self):
        return("Name: " + self.name + " | Label: " + self.label + " | Data: " + str(self.data))

    def toJSON(self):
        return{
                "name": self.name,
                "name": self.label,
                "data": self.data
              }