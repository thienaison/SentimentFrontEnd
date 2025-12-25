import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 20;

export default function Pagination({data, type}) {
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

     useEffect(() => {
        const endOffset = itemOffset + ITEMS_PER_PAGE;
        setCurrentItems(data.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(data.length / ITEMS_PER_PAGE));
    }, [itemOffset, data]);

    const handlePageClick = (event) => {
        const newOffset =
        (event.selected * ITEMS_PER_PAGE) % data.length;
        setItemOffset(newOffset);
    };


    return (
    <div className="data">
        <table>
            <thead>
                <tr>
                    <th>NO.</th>
                    <th>confidence</th>
                    <th>Sentiment</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
            {currentItems.map((item,index) => (
                <tr key={index}>
                <td>{index +1}</td>
                <td>{item.confidence}</td>
                <td>{item.sentiment}</td>
                <td>{item.comment}</td>
                </tr>
            ))}
            </tbody>
        </table>
        

      <ReactPaginate
        breakLabel="..."
        nextLabel="›"
        previousLabel="‹"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        containerClassName="pagination"
        activeClassName="active"
      />
    </div>
    )
}