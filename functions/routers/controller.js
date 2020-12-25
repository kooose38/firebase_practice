const db = require("./config")

module.exports = {
   getUsers: async (req, res) => {
      const prev = [];
      await db.collection("users").orderBy("created_at", "desc").get().then(snapshots => {
         snapshots.forEach(doc => {
            const data = doc.data()
            const id = doc.id;
            prev.push({
               id: id,
               ...data
            })
         })
         res.status(200).json(prev)
      }).catch((e) => {
         res.status(400).json({ message: e.message })
      })
   },
   postUsers: async (req, res) => {
      const name = req.body.name;
      const age = req.body.age;
      if (!name || !age) {
         res.status(400).json({ message: "必須項目を入力してください。" })
      }
      const gender = req.body.gender;
      const data = {
         name: name,
         age: parseInt(age, 10),
         gender: gender,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString()
      };

      const ref = db.collection("users").doc();
      const id = ref.id;
      data.id = id;

      try {
         await db.collection("users").doc(id).set(data);
         const doc = await db.collection("users").doc(id).get();
         const newData = doc.data()
         res.status(200).json(newData)
      } catch (e) {
         res.status(500).json({ message: e.message })
      }
   },
   putUsers: async (req, res) => {
      const id = req.params.id;
      if (!id) {
         res.status(400).json({ message: "id未入力エラー" })
      }
      const name = req.body.name;
      const age = req.body.age;
      const data = {
         updated_at: new Date()
      };
      if (name) {
         data.name = name
      }
      if (age) {
         data.age = age
      }

      await db.collection("users").doc(id).update(data, { marge: true }).then(() => {
         res.status(200).json({ message: "成功" })
      }).catch(e => {
         res.status(400).json({ message: e.message })
      })

   },
   deleteUsers: async (req, res) => {
      const id = req.params.id;

      await db.collection("users").doc(id).delete().then(() => {
         res.status(200).json({ message: "成功" })
      }).catch(e => {
         res.status(400).json({ message: e.message });
      })
   }
}