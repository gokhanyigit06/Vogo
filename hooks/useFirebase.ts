"use client"

import { useState, useEffect } from "react"
import { collection, query, getDocs, orderBy, limit, DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useFirestoreCollection(collectionName: string, maxItems: number = 10) {
    const [data, setData] = useState<DocumentData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const q = query(
                    collection(db, collectionName),
                    orderBy("createdAt", "desc"),
                    limit(maxItems)
                )
                const querySnapshot = await getDocs(q)
                const items = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setData(items)
            } catch (err) {
                console.error("Firebase fetch error:", err)
                setError(err as Error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [collectionName, maxItems])

    return { data, loading, error }
}
