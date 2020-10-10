class Stock:
    name = ""
    label = ""
    data = [[], [], [] ,[], [], [], [] ,[]] #ArrayList{ArrayList{"date" "Open" "High" "Low" "Close" "Volume"}}


    def __init__(self, new_name, new_label, new_data):
        name = new_name
        label = new_label
        data = new_data

    def toString(self):
        print("Name: " + self.name + " | Label: " + self.label)