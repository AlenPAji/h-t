import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
} from "react-native";

const App = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [data, setData] = useState<{ id: number; name: string; email: string }[]>([]);

    // Add New Contact
    const handleAdd = () => {
        if (name.trim() && email.trim()) {
            setData([...data, { id: data.length + 1, name, email }]);
            setName("");
            setEmail("");
        }
    };

    // Delete Contact
    const handleDelete = (id: number) => {
        setData(data.filter((item) => item.id !== id));
    };

    // Start Editing
    const handleEdit = (index: number) => {
        setEditIndex(index);
        setName(data[index].name);
        setEmail(data[index].email);
    };

    // Update Edited Contact
    const handleUpdate = () => {
        if (editIndex !== null) {
            let updatedData = [...data];
            updatedData[editIndex] = { ...updatedData[editIndex], name, email };
            setData(updatedData);
            setEditIndex(null);
            setName("");
            setEmail("");
        }
    };

    return (
        <View style={styles.container}>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                {editIndex === null ? (
                    <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.editButtons}>
                        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setEditIndex(null);
                                setName("");
                                setEmail("");
                            }}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Table Headers */}
            <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>ID</Text>
                <Text style={styles.headerCellname}>Name</Text>
                <Text style={styles.headerCellemail}>Email</Text>
                <Text style={styles.headerCellname}>Actions</Text>
            </View>

            {/* Data Table */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.row}>
                        <Text style={styles.idcell}>{item.id}</Text>
                        <Text style={styles.namecell}>{item.name}</Text>
                        <Text style={styles.cell}>{item.email}</Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => handleEdit(index)}
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item.id)}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    addButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
    },
    updateButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    cancelButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#ddd",
        paddingVertical: 10,
        marginBottom: 5,
    },
    headerCell: {
        flex: 0.5,
        fontWeight: "bold",
        textAlign: "center",
        marginLeft: -20,
    },
    headerCellname:{
        flex: 0.5,
        fontWeight: "bold",
        textAlign: "center",
        marginRight: 28,

    },
    headerCellemail:{
        marginRight: 50,
        fontWeight: "bold",
        textAlign: "center",

    },


    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    cell: {
        flex: 1,
        textAlign: "center",
    },
    idcell:{
        flex: 0.5,  // Reduce space occupied by ID column
        textAlign: "left",  // Align ID text to the left
        marginLeft: 10,  // Move ID column slightly left

    },
    namecell:{
        flex: 0.5,
        textAlign: "center",
        marginLeft: -17,

    },
    actionButtons: {
        flexDirection: "row",
        //justifyContent: "space-around",
        flex: 0.8,
        marginLeft: 13,

    },
    editButton: {
        backgroundColor: "orange",
        padding: 6,
        borderRadius: 5,
        marginRight: 5,
        paddingHorizontal: 7,
    },
    deleteButton: {
        backgroundColor: "red",
        padding: 5,
        borderRadius: 5,
    },
    editButtons: {
        flexDirection: "row",
    },
});

export default App;