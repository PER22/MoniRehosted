class Stock:
    name = ""
    label = ""
    data = [] #[["date" "Open" "High" "Low" "Close" "Volume"]]


    def __init__(self, new_name = None, new_label = None, new_data = None):
        if new_name is not None:
            self.name = new_name

        if new_data is not None:
            self.data = new_data

        if new_label is not None:
            self.label = new_label

    def toString(self):
        return("Name: " + self.name + " | Label: " + self.label + " | Data: " + str(self.data))

    def toJSON(self):
        return{
            "name": self.name,
            "label": self.label,
            "data": self.data
        }