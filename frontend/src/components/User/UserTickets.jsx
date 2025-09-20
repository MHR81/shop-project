
import { useState } from "react";
import TicketList from "./Tickets/TicketList";
import TicketChat from "./Tickets/TicketChat";
import TicketNew from "./Tickets/TicketNew";

export default function UserTickets() {
    const [selectedId, setSelectedId] = useState(null);
    const [refresh, setRefresh] = useState(false);

    return (
        <div>
            {!selectedId ? (
                <>
                    <TicketNew onCreated={() => setRefresh(r => !r)} />
                    <TicketList key={refresh} onSelect={setSelectedId} />
                </>
            ) : (
                <TicketChat ticketId={selectedId} onBack={() => setSelectedId(null)} />
            )}
        </div>
    );
}
