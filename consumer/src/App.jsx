import { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';


function App() {
  const [users, setUsers] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [userdata, setUserdata] = useState({ name: "", age: "", city: "" });
  const [mode, setMode] = useState(false);
  const [AUB, setAUB] = useState("Add");


  const getUsers = async () => {
    await axios.get("http://localhost:8000/users")
      .then((res) => {
        setUsers(res.data);
        setFilterList(res.data);

      });
  };
  useEffect(()=>{
    getUsers();
  },[]);
  
  const handleSearching = (e) => {
    const leter = e.target.value.toLowerCase();
    const SearchedList = users.filter((user) =>
      user.name.toLowerCase().includes(leter) || user.city.toLowerCase().includes(leter)
    );

    setFilterList(SearchedList);
  };

  const handleDelete = async (id) => {
    const conf = window.confirm("Are you Sure?");

    if (conf) {
      await axios.delete(`http://localhost:8000/users/${id}`).then(
        (res) => {
          setUsers(res.data);
          setFilterList(res.data);

        })
        .catch(
          (error) => {
            console.log("Error in  HandleDelete in App.jsx : ", error);
          }
        )
    }

  }
  const handler = (e) => {
    setUserdata({ ...userdata, [e.target.name]: e.target.value });
  }
  const submiter = async (e) => {
    e.preventDefault();
    if (userdata.id) {

      console.log("fromsubmit-patch");
      await axios.patch(`http://localhost:8000/users/${userdata.id}`, userdata).then(
        (res) => {
          setUsers(res.data);
          setFilterList(res.data);
          console.log("patched from App.jsx");
        }
      )
        .catch(
          (error) => {
            console.log(error);
          }
        )
    }
    else {
      await axios.post("http://localhost:8000/users", userdata)
        .then(
          (res) => {
            console.log("post-end");
            console.log(res.data);
            setUsers(res.data);
            setFilterList(res.data);
          }
        )
        .catch(
          (error) => {
            console.log(error);

          }
        )
    }
    setMode(false);

  };
  const handleAddUser = () => {

    setUserdata({ name: "", age:"" , city: "" });
  }
  const handleEditor = async (user) => {

    setMode(true);
    setUserdata(user);
  }

  return (
    <>
      <div className="container">
        <h3>CRUD application with ReactJS </h3>
        <div className="input-search">
          <input type="search" onChange={handleSearching} />
          <button className="btn" onClick={() => {
            setMode(true);
            handleAddUser();
            setAUB("Add");
          }} >Add Record</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>

            {filterList &&
              filterList.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td><button className="btn green" onClick={() => { handleEditor(user); setAUB("Update"); }}>Edit</button></td>
                    <td><button className="btn red" onClick={() => { handleDelete(user.id); }}
                    >Delete</button></td>
                  </tr>
                )
              })}

          </tbody>
        </table>

        {mode && (
          <div className="Showup">
            <div className="hea">
              <span className='Box' onClick={() => { setMode(false); getUsers(); }}>&times;</span>
              <p>{AUB} Record</p>


              <div className="input-group"><br />
                <label htmlFor='name'>Name:</label>
                <input type="text" name="name" id="name" placeholder='Name' value={userdata.name} onChange={handler} /><br />
                <label htmlFor='age'>Age:</label>
                <input type="number" name="age" id="age" placeholder='Age' value={userdata.age} onChange={handler} /><br />
                <label htmlFor="city">City:</label>
                <input type="text" name="city" id="city" placeholder='City' value={userdata.city} onChange={handler} /><br />
              </div>
              <button className='btn green' onClick={

                submiter

              }>{AUB}</button>
            </div>
          </div>)
        }
      </div >
    </>
  )
}
export default App;
