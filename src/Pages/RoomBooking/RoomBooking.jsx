import React, {useEffect , useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import './RoomBooking.css';

function RoomBooking() {
    const [rooms, setRooms] = useState([]);
    const {employee_id,brn_id} = useParams();
    const navigate = useNavigate();
    useEffect(()=>{
        getAvailableRooms()
    },[])

    const getAvailableRooms = async () => {
        try{
            let response = await fetch('http://localhost:8080/miancurocho/room/allAvailableRooms')
            let roomsData = await response.json()
            console.log(roomsData)
            setRooms(roomsData)

        }catch(error){
            console.error(error)
        }
        
    }

    const handleSubmitBook = (roomNumber, roomName) => {
        console.log(`Booked Room Number: ${roomNumber}, Room Type: ${roomName}`);
        navigate(`/booking/${employee_id}/${brn_id}/${roomNumber}`)
        // Add the logic to handle booking with roomNumber and roomName
    };
    
    
    return (
        <div className = "roomParent">
            <div className="roomContainer">
            <br></br>
            <br></br>
            <div className="roomHeader">
                <h1 >Available Rooms</h1>
            </div>
            <div className='cardDiv'>
            {rooms.map((room) => (
                <div className = "roomCard">

                <div  key={room.ROOM_NUMBER}>
                    <div className="roomContent">
                    <p className="roomNumber">Room Number: {room.ROOM_NUMBER}</p>
                    <p className="roomType">Room Type: {room.ROOM_NAME}</p>
                    <p className="roomType">Price: ₱{room.PRICE}.00 </p>
                    <p className="roomDeets">Max Guests: {room.MAX_GUESTS}</p>
                    <p>Beds: {room.BEDS}</p>
                    <p>Area: {room.AREA} square meters</p>
                    <br />
                    <p className="roomDescription"><i>{room.DESCRIPTION}</i></p>
                    </div>

                    <div className='roomButtonDiv'>
                    <button className = "roomButton btn" onClick={() => handleSubmitBook(room.ROOM_NUMBER, room.ROOM_NAME)}>Book</button>
                    {/* Add more properties as needed */}
                    </div>
                </div>
                </div>
            ))}
            </div>
            </div>
        </div>
    );
    
}

export default RoomBooking