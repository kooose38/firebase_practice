import React, { useState, useEffect, useCallback } from 'react';
import { db, FirebaseTimestamp } from "./firebase/index";


const App = () => {
   //state
   const
      [data, setData] = useState(),
      [name, setName] = useState(""),
      [document, setDocument] = useState(""),
      [age, setAge] = useState("");

   const inputName = useCallback((e) => {
      setName(e.target.value)
   }, [setName]);
   const inputAge = useCallback((e) => {
      setAge(e.target.value)
   }, [setAge]);
   const inputDoc = useCallback((e) => {
      setDocument(e.target.value)
   }, [setDocument]);
   //GET
   const getHandle = async () => {
      const prev = [];
      await db.collection("users").orderBy("created_at", "desc").get().then(snapshots => {
         snapshots.forEach(doc => {
            const data = doc.data()
            const id = doc.id;
            prev.push({
               id: id,
               ...data
            });
         })
         setData(prev);
      }).catch((e) => {
         alert(e.message)
      })
   };
   //POST
   const addHandle = async () => {
      const timestamp = FirebaseTimestamp.now()
      const ref = await db.collection("users").doc()
      const id = ref.id;
      const data = {
         name: name,
         age: parseInt(age, 10),
         created_at: timestamp,
         updated_at: timestamp,
         id: id
      };
      await db.collection("users").doc(id).set(data).then(() => {
         alert("追加しました。")
      }).catch((e) => {
         alert(e.message);
      })
   };
   //PUT
   const updatedHandle = async () => {
      const timestamp = FirebaseTimestamp.now();
      if (document === "") {
         alert("必須項目です。")
         return;
      }
      const data = {
         updated_at: timestamp
      }
      if (name !== "") {
         data.name = name
      }
      if (age !== "") {
         data.age = parseInt(age, 10)
      }
      await db.collection("users").doc(document).update(data, { marge: true }).then(() => {
         alert("更新しました。")
      }).catch((e) => {
         alert(e.message);
      })
   };
   //DELETE
   const deleteHandle = async () => {
      if (document === "") {
         alert("必須項目です。")
         return;
      }
      await db.collection("users").doc(document).delete().then(() => {
         alert("削除しました。")
      }).catch((e) => {
         alert(e.message);
      })
   };
   //componentWillUnmount
   useEffect(() => {
      const unsubscribe = () => db.collection("users").orderBy("created_at", "asc").onSnapshot((results) => {
         const prev = [];
         results.forEach(doc => {
            const data = doc.data()
            const id = doc.id;
            prev.push({
               id: id,
               ...data
            })
         })
         setData(prev)
      })
      return () => unsubscribe()
   }, []);

   return (
      <div style={{ maxWidth: 800, margin: " 0 auto" }}>
         <h1>
            user list
         </h1>
         <div>
            <button onClick={getHandle}>リスト表示</button>
            <button onClick={addHandle}>作成</button>
            <button onClick={updatedHandle}>更新</button>
            <button onClick={deleteHandle}>削除</button>
         </div>
         <div>
            <input placeholder="name" value={name} onChange={(e) => inputName(e)} type="text" />
            <input placeholder="age" value={age} onChange={(e) => inputAge(e)} type="number" />
            <input placeholder="ID" value={document} onChange={(e) => inputDoc(e)} type="text" />
         </div>
         <div>
            {data && data.map(data =>
               <ul key={data.id}>
                  <li>{data.id}</li>
                  <li>{data.name}</li>
                  <li>{data.age}</li>
               </ul>
            )}
         </div>
      </div>
   )
};

export default App;

