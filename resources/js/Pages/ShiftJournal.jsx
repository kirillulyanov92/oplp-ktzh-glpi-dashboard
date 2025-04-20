import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";

export default function ShiftJournal() {
    const { shifts, auth } = usePage().props;
    const [comment, setComment] = useState("");

    const submitComment = async (shiftId) => {
        router.post("/shift-comments", { shift_id: shiftId, comment });
        setComment("");
    };

    return (
        <div>
            <h1>Журнал смен</h1>
            {shifts.map((shift) => (
                <div key={shift.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
                    <h3>
                        {shift.user.name} - {shift.type === "day" ? "Дневная" : "Ночная"} смена ({shift.date})
                    </h3>
                    {shift.comments.map((c) => (
                        <p key={c.id}>{c.user.name}: {c.comment}</p>
                    ))}
                    {shift.user.id === auth.user.id && (
                        <div>
                            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Оставить комментарий" />
                            <button onClick={() => submitComment(shift.id)}>Отправить</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
