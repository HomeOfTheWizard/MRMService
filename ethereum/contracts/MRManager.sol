pragma solidity ^0.4.25;

contract MRManager{

    uint public roomNb;
    uint public roomCalendarSize;
    address manager;
    mapping (address => bool) clients;

    struct RoomCalendar{
        bool initialized;
        uint[] reservedTimeSlots;
        string[] reservedUsers;
        string[] reservationDescriptions;
        mapping(uint => uint) timeSlotIndex;
    }

    mapping(uint => RoomCalendar) roomCalendarsMap;

    modifier restrictedToManager(){
        require(msg.sender == manager);
        _;
    }

    modifier restrictedToClients(){
        require(clients[msg.sender] == true);
        _;
    }

    constructor (uint roomNumber, uint timeSlotSize, address creator, address[] clientApps) public {
        manager = creator;
        roomNb = roomNumber;
        roomCalendarSize = timeSlotSize;

        for (uint i=0; i<clientApps.length; i++){
          clients[clientApps[i]] = true;
        }
    }


    function reserveRoom(uint roomId, uint reservationTimeSlotId, string user) public restrictedToClients{
        require(roomId <= roomNb);
        require(roomId != 0);
        require(reservationTimeSlotId <= roomCalendarSize);
        require(reservationTimeSlotId != 0);

        uint index;

        if(!roomCalendarsMap[roomId].initialized){
            RoomCalendar memory newCalendar = RoomCalendar(true, new uint[](0), new string[](0), new string[](0));
            roomCalendarsMap[roomId] = newCalendar;
        }

        RoomCalendar storage roomCalendar = roomCalendarsMap[roomId];

        if( roomCalendar.reservedTimeSlots.length==0 || roomCalendar.reservedTimeSlots[ roomCalendar.timeSlotIndex[reservationTimeSlotId] ] != reservationTimeSlotId)
        {
            index = roomCalendar.reservedTimeSlots.length;
            roomCalendar.reservedTimeSlots.push(reservationTimeSlotId);
            roomCalendar.reservedUsers.push(user);
            roomCalendar.timeSlotIndex[reservationTimeSlotId] = index;
        }else
            revert("this room is already booked for given timeslot");
    }


    function cancelReservation(uint roomId, uint reservationTimeSlotId, string user) public restrictedToClients{
        require(roomId <= roomNb);
        require(roomId != 0);
        require(reservationTimeSlotId <= roomCalendarSize);
        require(reservationTimeSlotId != 0);

        RoomCalendar storage roomCalendar = roomCalendarsMap[roomId];

        uint index;
        uint length;

        if( roomCalendar.reservedTimeSlots.length !=0
            && roomCalendar.reservedTimeSlots[ roomCalendar.timeSlotIndex[reservationTimeSlotId] ] == reservationTimeSlotId
            && keccak256(roomCalendar.reservedUsers[ roomCalendar.timeSlotIndex[reservationTimeSlotId] ]) == keccak256(user)
        )
        {
            length = roomCalendar.reservedTimeSlots.length;
            index = roomCalendar.timeSlotIndex[reservationTimeSlotId];

            delete roomCalendar.reservedTimeSlots[index];
            delete roomCalendar.reservedUsers[index];

            if(index != length-1){
                uint swappedIndex = roomCalendar.reservedTimeSlots[length -1];
                roomCalendar.timeSlotIndex[swappedIndex] = index;

                roomCalendar.reservedTimeSlots[index] = roomCalendar.reservedTimeSlots[length -1];
                delete roomCalendar.reservedTimeSlots[length -1];

                roomCalendar.reservedUsers[index] = roomCalendar.reservedUsers[length -1];
                delete roomCalendar.reservedUsers[length -1];
            }

            roomCalendar.timeSlotIndex[reservationTimeSlotId] = 0;
            roomCalendar.reservedUsers.length--;
            roomCalendar.reservedTimeSlots.length--;
        }else
          revert("cannot cancel this reservation");
    }


    function getRoomAvailability(uint roomId) public view returns(uint roomID, uint[] reservedTimeSlots){
        require(roomId <= roomNb);
        require(roomId != 0);

        roomID = roomId;
        reservedTimeSlots = roomCalendarsMap[roomId].reservedTimeSlots;
    }

    function getReservations(uint roomId, string user) public view returns(uint roomID, uint[] reservations){
        require(roomId <= roomNb);
        require(roomId != 0);

        uint[] memory userReservations = new uint[](roomCalendarSize);
        uint[] storage reservedTimeSlots = roomCalendarsMap[roomId].reservedTimeSlots;
        string[] storage reservedUsers = roomCalendarsMap[roomId].reservedUsers;
        uint x = 0;

        for (uint i=0; i<reservedUsers.length; i++){
          if( keccak256(reservedUsers[i]) == keccak256(user) ){
              userReservations[x++] = reservedTimeSlots[i];
          }
        }

        roomID = roomId;
        reservations = userReservations;
    }
}
