import { useAuth } from '../context/AuthContext'

export function useSettings(docId) {
    const { settings, settingsLoaded } = useAuth()
    return {
        data: settings[docId],
        loading: !settingsLoaded
    }
}

export async function saveSettings(docId, data) {
    const { setDoc, doc } = await
    import ('firebase/firestore')
    const { db } = await
    import ('../firebase/config')
    await setDoc(doc(db, 'settings', docId), data, { merge: true })
}