import React, { useEffect, useRef } from "react"
import './index.css';
import { useAppDispatch } from "../../../src/store/hoocs";
import { IFinance } from "../../utils/types";
import { deleteUserFinance } from "../../../src/store/Reducers/financeReducer";
import { toast } from "react-toastify";

interface Props {
    setIsDeleteModal: (id: string) => void;
    financeId: string;
    finance: IFinance;
}

const ModalDeleteFinance: React.FC<Props> = ({ financeId, setIsDeleteModal, finance }) => {
    const dispatch = useAppDispatch();

    const handleDeleteFinance = async (financeId: string) => {
        try {
            await dispatch(deleteUserFinance({ financeId }));
            toast.success('Finance record deleted successfully');
            setIsDeleteModal(finance._id);
        } catch (e) {
            console.log(e);
        }
    };

    const modalRef = useRef<any>(null);
    const handleEscapePress = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsDeleteModal(finance._id);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleEscapePress);

        return () => {
            document.removeEventListener('keydown', handleEscapePress);
        };
    }, []);

    return (
        <div className="modal">
            <form onSubmit={(e) => e.preventDefault()} className="modal-content" ref={modalRef}>
                <span className="close" onClick={() => setIsDeleteModal(finance._id)}></span>
                <h2 style={{padding: '1rem'}}>Вы действительно хотите удалить запись {finance.name}</h2>
                <button className='delete' onClick={() => handleDeleteFinance(finance._id)}>Удалить запись</button>
            </form>
        </div>
    );
}

export default ModalDeleteFinance;
