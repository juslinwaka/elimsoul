// utils/firestoreUtils.ts
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";

export const updateLessonProgress = async (lessonId: string, progress: number) => {
  const user = getAuth().currentUser;
  if (!user) return;

  const userLessonRef = doc(db, `users/${user.uid}/lessons/${lessonId}`);
  await setDoc(userLessonRef, { progress }, { merge: true });
};
