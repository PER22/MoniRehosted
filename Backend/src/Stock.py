class Stock:
    name = ""
    label = ""
    data = [[], [], [] ,[], [], [], [] ,[]] #ArrayList{ArrayList{"date" "Open" "High" "Low" "Close" "Volume"}}


    def __init__(self, new_name, new_label, new_data):
        self.name = new_name
        self.label = new_label
        self.data = new_data

    def toString(self):
        return("Name: " + self.name + " | Label: " + self.label + " | Data: " + str(self.data))