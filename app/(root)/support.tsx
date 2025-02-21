import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Alert
} from "react-native";

const Support = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const handleSubmit = () => {
        if (!name || !email || !phone || !description) {
            Alert.alert("Error", "Please fill out all fields before submitting.");
            return;
        }
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Need Support?</Text>

            <TextInput
                style={styles.input}
                placeholder="Your name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Problem description"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            {/* Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            Thank you for contacting us. We will provide the needful at the earliest.
                        </Text>
                        <TouchableOpacity
                            style={styles.okButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 15,
        borderRadius: 5,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
    },
    okButton: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        width: "50%",
        alignItems: "center",
    },
});

export default Support;