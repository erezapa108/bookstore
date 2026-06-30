import { useState } from "react";

function BookForm() {
    console.log("BookForm Render")

    const [title, setTitle] = useState("");

    return (
        <div>
            <h2>Tambah Buku</h2>

            <input
            type="text"
            placeholder="Masukkan Judul Buku"
            value={title}
            onChange={(event) => {
                setTitle(event.target.value);
            }}
            />

            <p>
                Judul yang diketik: 
                {" "}
                {title}
            </p>
        </div>
    );
}

export default BookForm;