import React, { useEffect, useState } from 'react'
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination} from "@mui/material";
import './Payment.css'
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate, useParams } from 'react-router-dom';


function Payment() {
    const {brn_id,employee_id} = useParams();
    const [currentDate, setCurrentDate] = useState([]);
    const navigate = useNavigate();
    const [rows,setRows] = useState([])

    useEffect( async ()=>{
        getCurrentDate();
        getCharges()
      },[])

    const getCharges = async () => {
        try {
            let response = await fetch(`http://localhost:8080/miancurocho/charge/chargesOfBRN/${brn_id}`);
            let chargesData = await response.json();
            console.log(chargesData);
    
            //GET BRN DETAILS OF ALL
            const generatedRows = await Promise.all(chargesData.map(async (charge) => {
                
                    return {
                        "date":"12-12-23",
                        "details":charge.room_number,
                        "kitchen":"food",
                        "concierge":"Transpo",
                        "housekeeping":"Broken Bulb",
                        "total":charge.cost,
                    };
            
            }));
    
            setRows(generatedRows);
            console.log(generatedRows)
        } catch (error) {
            console.error(error);
        }
    };
      
    const getCurrentDate = () => {

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`;
        setCurrentDate(formattedDate)
        console.log(currentDate)
        
    }
    const handleCheckOutTrue = async () =>{
        const brnToUpdate = {
            brn_id: brn_id,
            check_out_date: currentDate,
            status: "CHECKED-OUT"
        }

        try{
            const response = await fetch('http://localhost:8080/miancurocho/brn/update', {
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(brnToUpdate)
            })
            console.log(brnToUpdate)
            navigate(`/fd/dashboard/${employee_id}`)
            }catch(error){
            //ADD FRONTEND ERROR DISPLAY HERE 
            console.log('Checkout Error. Please Try again')
            console.log(error)
        }
    }


    const columns = [
        {id:"date", name:"Date"},
        {id:"details", name:"Details"},
        {id:"kitchen", name:"Kitchen"},
        {id:"concierge", name:"Concierge"},
        {id:"housekeeping", name:"Housekeeping"},
        {id:"total", name:"Total"}
      ]
    
      
    
      const [page, pageChange] = useState(0)
      const [rowPerPage, rowPerPageChange] = useState(5)
    
      const handlechangepage =(event,newpage) => {
        pageChange(newpage)
      }
      
      const handleRowsPerPage = (event) => {
        rowPerPageChange(+event.target.value)
        pageChange(0)
      }

const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

    
  const totalCost = rows.reduce((acc, row) => acc + row.total, 0);

  const [paymentType, setPaymentType] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  return (
    <section className="paymentSec">
        <div className="paymentContainer">
            <div className="welcomePayment flex">
                <div className="leftWelcome">
                    <h1 className='dashboardTitle'>Payment</h1>
                    <p className='dashboardTitle'>Welcome back, NAME HERE!</p>
                </div>
                
            </div>
            <div className="guestList">
                <h3><i>Availed Services: </i></h3>
            </div>
            <div className="tableDiv">
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column)=>(
                                        <TableCell style={{backgroundColor:"#231F20", color:"#ad974f"}} key={column.id} align="center">{column.name}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows
                            .slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                            .map((row, i) => {
                                return (
                                <TableRow key={i}>
                                    {columns.map((column, j) => {
                                    let value = row[column.id];
                                    if (["total"].includes(column.id)) {
                                        return (
                                        <TableCell key={j} align="center" 
                                            >
                                            <div className="cellDiv" style={{ display: "flex", alignItems:"center",justifyContent:"center", flexDirection: "column" }}>
                                                {value}$
                                            </div>
                                        </TableCell>
                                        );
                                    }
                                    return (
                                        <TableCell key={j} align="center">
                                        {value}
                                        </TableCell>
                                    );
                                    })}
                                    
                                </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                            rowPerPageOption={[5,10,25]}
                            page={page}
                            count = {rows.length}
                            rowsPerPage={rowPerPage}
                            component="div"
                            onPageChange={handlechangepage}
                            onRowsPerPageChange={handleRowsPerPage}
                    >
                    </TablePagination>
                </Paper>
            </div>
            <div className="totalCostDiv">
                <p><b>Total Cost: {totalCost}$</b></p>
            </div>
            <div className="payButtonDiv">
                <button className="payButton btn" 
                onClick={toggleModal}
                >
                    <a>Pay now</a>
                </button>
            </div>
        </div>
        {modal && (
        <div className="modal">
            <div onClick={toggleModal} className="overlay">

            </div>
            <div className="modal-content">
                <CancelIcon 
                className="close-modal" 
                onClick={toggleModal}
                style={{fontSize:"2.5rem"}}
                />
                <div className="paymentTitle">
                    <h2>Payment Details</h2>
                </div>
                <div className="paymentType" >
                    <label htmlFor="paymentType">Mode of Payment:  </label>
                    <select id="paymentType" name="payment" onChange={handlePaymentTypeChange}>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                    </select>
                </div>
                {paymentType === "card" && (
              <div className="cardNumberInput">
                    <div className="cardNumber">
                        <label htmlFor="cardNumber">Card Number: </label>
                        <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardNumber}
                        placeholder='0123 4567 8901 2345'
                        />
                    </div>
                    <div className="cvvAndEd">
                        <label htmlFor="CVV">CVV: </label>
                        <input
                        type="text"
                        placeholder='123'
                        />
                    </div>
                    <div className="expDate">
                        <label htmlFor="expirationDate">Expiration Date: </label>
                        <input
                        type="text"
                        placeholder='YYYY-MM-DD'
                        />
                    </div>
                </div>
                )}
                <div className="proceedToPayment">
                    <button className="proctopay btn " onClick={handleCheckOutTrue}>Pay</button>
                </div>
            </div>
        </div>
        )}
    </section>
  )
}

export default Payment;