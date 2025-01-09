import React from "react";
import Skeleton from "react-loading-skeleton";

const Table = ({ columns, data, status, onDelete }) => {
    console.log(data);
    return (
        <div className="overflow-x-auto p-2">
            <table className="min-w-full table-auto bg-white border-collapse border border-black-200">
                <thead className="bg-customBlue text-black">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="py-3 px-4 text-left font-bold"
                            >
                                {column.label}
                            </th>
                        ))}
                        <th scope="col" className="py-3 px-4 text-left font-bold">
                            Download
                        </th>
                        <th scope="col" className="py-3 px-4 text-left font-bold">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {status === "loading" && (
                        <tr>
                            <td colSpan={columns.length + 2} className="py-4 px-4">
                                <Skeleton count={10} height={40} />
                            </td>
                        </tr>
                    )}
                    {status === "failed" && (
                        <tr>
                            <td colSpan={columns.length + 2} className="py-4 px-4">
                                <p className="text-center font-bold text-red-500">
                                    {"Data not found"}
                                </p>
                            </td>
                        </tr>
                    )}
                    {status === "succeeded" &&
                        data.map((item, index) => (
                            <tr
                                key={item._id}
                                className="border-b border-gray-200 hover:bg-gray-100 transition ease-in-out duration-150"
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="py-3 px-4">
                                        {column.accessor
                                            ? column.accessor === "serialNumber"
                                                ? index + 1
                                                : column.formatter
                                                    ? column.formatter(item[column.accessor])
                                                    : item[column.accessor]
                                            : ""}
                                    </td>
                                ))}
                                <td className="py-3 px-4">
                                    <a
                                        href={item.Pdf}
                                        target="_blank"
                                        className="text-blue-500 hover:text-blue-700 transition duration-150"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="bi bi-cloud-download-fill"></i>
                                    </a>
                                </td>
                                <td className="py-3 px-4">
                                    <div
                                        className="cursor-pointer text-red-500 hover:text-red-700 transition duration-150"
                                        onClick={() => onDelete(item._id)}
                                    >
                                        <i className="bi bi-trash text-lg"></i>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
