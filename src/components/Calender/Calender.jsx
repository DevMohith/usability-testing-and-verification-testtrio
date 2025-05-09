import React, { useState, useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { loadEvents } from "../../redux/store";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CreateEvent from "./CreateEvent";
import "./Calendar.css";

const Calender = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events || []);

  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState({ date: "", time: "" });
  const [editingEvent, setEditingEvent] = useState(null);

  //below loading events when comp mounts
  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  // getting todays date to restrict past event cre - after uasable review from suhas
  const today = new Date().toISOString().split("T")[0];

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr.split("T")[0];
    const selectedTime = info.dateStr.includes("T") 
      ? info.dateStr.split("T")[1].slice(0, 5) 
      : "00:00"; 


      // block happened days - review from suhas
    if (selectedDate < today) return;
    
    // Check if the current view is Month View
  const calendarApi = info.view.calendar;
  if (calendarApi.view.type === "dayGridMonth") {
    return; 
  }

    setSelectedDateTime({ date: selectedDate, time: selectedTime });
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEventClick = (clickInfo) => {
    const eventStart = new Date(clickInfo.event.startStr);
    const eventTime = eventStart.toTimeString().slice(0, 5);
  
    setEditingEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      time: eventTime,
      description: clickInfo.event.extendedProps.description || "",
      attendees: clickInfo.event.extendedProps.attendees || "",
      createdBy: clickInfo.event.extendedProps.createdBy,
    });
  
    setShowEventForm(true);
  };
  

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "today prev,next",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth",
        }}
        selectable={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events}
        // this range kills past days active state
        validRange={{ start: today }} 
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }}
        dayCellContent={(arg) => {
          const viewType = arg.view.type;
          return (
            <div data-testid={`date-${arg.date.toISOString().split("T")[0]}-${viewType}`}>
              {arg.dayNumberText}
            </div>
          );
        }}
      />

      {showEventForm && (
        <CreateEvent
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        selectedDateTime={selectedDateTime}
        editingEvent={editingEvent}
      />
      
      )}
    </div>
  );
};

export default Calender;
