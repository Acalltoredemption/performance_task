import React, { useEffect, useState } from "react";
import Filter from "./Filter/Filter";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import { UserData } from "../../types/types";
import MaterialTable from "material-table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const UserTable: React.FC = () => {
  //Main state storage for user data
  const [userData, setUserData] = useState<any>();
  //Filtered State
  const [filterState, setFilterState] = useState<any>();
  // Material table data
  const columns = [
    { title: "ID", field: "id" },
    { title: "First", field: "first_name" },
    { title: "Last", field: "last_name" },
    { title: "MI", field: "middle_initial" },
    { title: "District", field: "district" },
    { title: "Verified", field: "verified" },
    { title: "Active", field: "active" },
    { title: "Created", field: "created_at" },
  ];

  //Controls the open/closed state of modals
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [editModalShow, seteditModalShow] = useState<boolean>(false);
  const [newModalShow, setnewModalShow] = useState<boolean>(false);
  const [error, setError] = useState("");

  //Set Initial state on first render
  const [initialState, setInitialState] = useState<any>("");
  //Select row in datatable for restyling
  const [selectedRow, setSelectedRow] = useState(null);
  const [timesToggled, setTimesToggled] = useState(1);

  //Store potential validation error message
  // Hold Data of To-Be-Edited User
  const [editUserData, seteditUserData] = useState<UserData>({
    first_name: "test",
    last_name: "test",
    middle_initial: "test",
    active: false,
    email: "test",
    district: 0,
    verified: false,
    id: 0,
    created_at: "",
  });
  //Hold Data of New User
  const [newUserData, setnewUserData] = useState<UserData>({
    first_name: "",
    last_name: "",
    middle_initial: "",
    active: false,
    email: "",
    district: 0,
    verified: false,
    id: 0,
    created_at: "",
  });
  //Store user.id while in modal prior to confirming deletion
  const [deletionID, setDeletionId] = useState<any>(-2);
  //Store specifications from filter component
  const [filterData, setFilterData] = useState<any>({
    district: "",
  });

  //Show Delete Modal, Store user.id in state
  const handleModalDelete = (user) => {
    setModalShow(true);
    const deleteId = user.id;
    setDeletionId(deleteId);
  };

  const hideModal = () => {
    setModalShow(false);
  };

  //Edit Modal functionality
  const hideEditModal = () => {
    seteditModalShow(false);
  };

  //Retrieve index of a given user, and filter them out
  const handleDeleteUser = (deletionID: number) => {
    const usersArray = userData;
    const myid = deletionID;
    const index = userData.findIndex(function (o) {
      return o.id === myid;
    });
    const newArray = usersArray.filter((_, i: number) => i !== index);
    setUserData(newArray);
    setModalShow(false);
    toast.success("User Deleted");
  };
  //Initial rendering of users
  useEffect(() => {
    fetch("users.json")
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setInitialState(data);
      });
  }, []);

  useEffect(() => {
    setUserData(initialState);
    setTimesToggled(timesToggled + 1);
  }, [filterData]);

  //Conditional rendering of users based on filterData state change of district
  useEffect(() => {
    if (userData) {
      setUserData(initialState);
      if (filterData.district == "Select a District") {
        setUserData(initialState);
      } else if (filterData.district !== "Select a District") {
        const usersArray = [...userData].filter(function (e) {
          return e.district == filterData.district;
        });
        setFilterState(usersArray);
      }
    }
    return;
  }, [timesToggled]);

  //functions pertaining to opening edit modal, populating edit user data, and pushing new user data to overall state
  const handleEditUser = (user) => {
    seteditUserData(user);
    seteditModalShow(true);
  };
  const handleEditChange = (e) => {
    e.preventDefault();
    seteditUserData({ ...editUserData, [e.target.id]: e.currentTarget.value });
  };

  const finalizeEditUser = (editUserData: UserData) => {
    const usersArray = userData;
    const myid = editUserData.id;
    const index = userData.findIndex(function (o) {
      return o.id === myid;
    });
    const newArray = usersArray.filter((_, i: number) => i !== index);
    newArray.unshift(editUserData);
    setUserData(newArray);
    seteditModalShow(false);
    toast.success("User Edited");
  };
  // functions pertaining to opening new user modal, populating new user data, and pushing new user data to overall state
  const handleNewUserModal = () => {
    setnewModalShow(true);
  };
  const hideNewModal = () => {
    setnewModalShow(false);
  };

  const newUserChange = (e) => {
    e.preventDefault();
    setnewUserData({
      ...newUserData,
      [e.target.id]: e.target.value,
      created_at: new Date().toString(),
    });
  };

  const finalizeNewUser = (newUserData: UserData) => {
    //Regex for validating certain fields
    const letterValidation = /^[a-zA-Z]+$/;
    const numberValidation = /^[1-4]$/;
    const emailValidation =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (
      newUserData.first_name == "" ||
      newUserData.last_name == "" ||
      newUserData.email == "" ||
      newUserData.district == 0
    ) {
      setError("Please fill in all fields to proceed!");
    } else if (
      !newUserData.first_name.match(letterValidation) ||
      !newUserData.last_name.match(letterValidation) ||
      !newUserData.middle_initial.match(letterValidation)
    ) {
      setError(
        "First Name, Middle Initial, and Last Name fields must be letters only."
      );
    } else if (newUserData.first_name.length <= 2) {
      setError("First name must be three or more letters");
    } else if (newUserData.first_name.length >= 30) {
      setError("First name cannot be over 30 letters");
    } else if (newUserData.middle_initial.length > 1) {
      setError("Middle Initial must be 1 letter");
    } else if (!newUserData.district.match(numberValidation)) {
      setError("District field should be a number between 1-4");
    } else if (!newUserData.email.match(emailValidation)) {
      setError("Please input a valid email!");
    } else {
      setError("");
      const userArray = [...userData];
      userArray.unshift(newUserData);
      setUserData(userArray);
      setnewModalShow(false);
      toast.success("User Created");
    }
  };

  const eventHandler = (data) => setFilterData(data);

  useEffect(() => {
    setUserData(filterState);
  }, [filterState]);

  return (
    <div>
      <ToastContainer />
      <div className="overallgridbox" style={{ marginTop: "7rem" }}>
        <div className="usersgridbox">
          <div className="userslist">
            <div className="userstable">
              <div className="headings headingselement">
                <MaterialTable
                  title="User Data"
                  data={userData}
                  columns={columns}
                  actions={[
                    {
                      icon: "edit",
                      tooltip: "Edit User",
                      onClick: (e, user) => {
                        handleEditUser(user);
                      },
                    },
                    {
                      icon: "delete",
                      tooltip: "Delete User",
                      onClick: (e, user) => {
                        handleModalDelete(user);
                      },
                    },
                    {
                      icon: "add",
                      tooltip: "Add User",
                      onClick: () => {
                        handleNewUserModal();
                      },
                      isFreeAction: true,
                    },
                  ]}
                  onRowClick={(evt, selectedRow) =>
                    setSelectedRow(selectedRow.first_name)
                  }
                  options={{
                    paging: true,
                    pageSize: 20,
                    emptyRowsWhenPaging: true,
                    pageSizeOptions: [5, 10, 20, 50],
                    rowStyle: (rowData) => ({
                      backgroundColor:
                        selectedRow === rowData.first_name ? "#dbb63d" : "#FFF",
                      color:
                        selectedRow === rowData.first_name ? "#FFF" : "#000000",
                    }),
                  }}
                />
              </div>
              <Modal show={modalShow}>
                <Modal.Header>Confirm Deletion</Modal.Header>
                <Modal.Body>Are you SURE You want to Delete?</Modal.Body>
                <Modal.Footer>
                  <button className="btn btn-primary" onClick={hideModal}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleDeleteUser(deletionID)}
                  >
                    Delete
                  </button>
                </Modal.Footer>
              </Modal>
              <Modal show={newModalShow}>
                <Modal.Header>New User</Modal.Header>
                <Modal.Body>
                  <Form.Group>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Label>First Name:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={newUserChange}
                      id="first_name"
                      name="edit-firstname"
                      value={newUserData.first_name}
                    ></Form.Control>
                    <Form.Label>Last Name:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={newUserChange}
                      id="last_name"
                      name="edit-lastname"
                      value={newUserData.last_name}
                    ></Form.Control>
                    <Form.Label>Middle Initial:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={newUserChange}
                      id="middle_initial"
                      name="edit-middle"
                      value={newUserData.middle_initial}
                    ></Form.Control>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                      type="email"
                      onChange={newUserChange}
                      id="email"
                      name="edit-email"
                      value={newUserData.email}
                    ></Form.Control>
                    <Form.Label>District:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={newUserChange}
                      id="district"
                      name="edit-district"
                      value={newUserData.district}
                    ></Form.Control>
                    <Form.Label>Verified:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={newUserChange}
                      id="verified"
                      name="edit-verified"
                      value={newUserData.verified.toString()}
                    ></Form.Control>
                    <Form.Label>Active:</Form.Label>
                    <Form.Control
                      type="boolean"
                      onChange={newUserChange}
                      id="active"
                      name="edit-active"
                      value={newUserData.active.toString()}
                    ></Form.Control>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <button className="btn btn-primary" onClick={hideNewModal}>
                    Cancel
                  </button> 
                  <button
                    className="btn btn-success"
                    onClick={(e) => finalizeNewUser(newUserData)}
                  >
                    {" "}
                    Create User{" "}
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={editModalShow}>
                <Modal.Header>Edit User</Modal.Header>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label>First Name:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleEditChange}
                      id="first_name"
                      name="edit-firstname"
                      value={editUserData.first_name}
                    ></Form.Control>
                    <Form.Label>Last Name:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleEditChange}
                      id="last_name"
                      name="edit-firstname"
                      value={editUserData.last_name}
                    ></Form.Control>
                    <Form.Label>Middle Initial:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleEditChange}
                      id="middle_initial"
                      name="edit-firstname"
                      value={editUserData.middle_initial}
                    ></Form.Control>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                      type="email"
                      onChange={handleEditChange}
                      id="email"
                      name="edit-email"
                      value={editUserData.email}
                    ></Form.Control>
                    <Form.Label>District:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleEditChange}
                      id="district"
                      name="edit-firstname"
                      value={editUserData.district}
                    ></Form.Control>
                    <Form.Label>Verified:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleEditChange}
                      id="verified"
                      name="edit-firstname"
                      value={editUserData.verified.toString()}
                    ></Form.Control>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <button className="btn btn-primary" onClick={hideEditModal}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => finalizeEditUser(editUserData)}
                  >
                    {" "}
                    Edit{" "}
                  </button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>

        <div className="filtergridbox">
          <Filter className="filterstyler" onChange={eventHandler} />
        </div>
      </div>
    </div>
  );
};

export default UserTable;
