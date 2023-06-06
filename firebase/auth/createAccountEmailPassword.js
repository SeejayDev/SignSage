import { firebase_auth } from "firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function createAccountEmailPassword(email, password) {
    let result = null, error = null;
    
    try {
        result = await createUserWithEmailAndPassword(firebase_auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
