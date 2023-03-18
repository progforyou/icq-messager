import React from "react";

export const AddFileDropdown = (props) => {
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.useRef(null);
    const ref = React.useRef(null);
    const fileRef = React.useRef(null);
    const [file, setFile] = React.useState(null);
    const photoRef = React.useRef(null);
    
    const toggleDropdownPopover = () => {
        setDropdownPopoverShow((v) => !v);
    };
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && !btnDropdownRef.current.contains(event.target)) {
                setDropdownPopoverShow(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    const handleFileOpen = () => {
        fileRef.current.click()
        setDropdownPopoverShow(false)
    }
    const handlePhotoOpen = () => {
        photoRef.current.click()
        setDropdownPopoverShow(false)
    }
    return (
        <div className={"relative"}>
            <input type="file" onChange={handleFileChange} hidden ref={fileRef}/>
            <input type="file" accept="image/*, video/*" onChange={handlePhotoOpen} hidden ref={photoRef}/>
            <i ref={btnDropdownRef} onClick={(e) => {
                e.preventDefault();
                toggleDropdownPopover();
            }} className={"fa fa-plus-circle cursor-pointer text-blueGray-700 hover:text-blueGray-500 text-xl"}></i>
            <div ref={ref}
                className={
                    (dropdownPopoverShow ? "block " : "hidden ") +
                    "absolute bottom-0 mb-5 bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
                }
            >
                <ul className={"flex flex-col p-1"}>
                    <li onClick={handleFileOpen} className={"hover:bg-blueGray-200 py-2 px-3 cursor-pointer whitespace-nowrap"}>
                        <i className={"fa fa-file mr-3"}></i> Файл
                    </li>
                    <li onClick={handlePhotoOpen} className={"hover:bg-blueGray-200 py-2 px-3 cursor-pointer whitespace-nowrap"}>
                        <i className={"fa fa-photo-video mr-1"}></i> Фото или видео
                    </li>
                    <li onClick={props.startRecord} className={"hover:bg-blueGray-200 py-2 px-3 cursor-pointer whitespace-nowrap"}>
                        <i className={"fa fa-microphone mr-3"}></i> Голосовое сообщение 
                    </li>
                </ul>
            </div>
        </div>
    );
};
