import React from "react";
import Skeleton from "react-loading-skeleton";

const CommanTable = ({ columns, data, status, onDelete, onEdit, databstarget, model }) => {
  function stripHtmlTags(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  return (
    <div className="overflow-x-auto p-2">
      <table className="min-w-full table-auto bg-white border border-gray-200">
        <thead className="bg-[#cfe2ff]">
          <tr>
            <th scope="col" className="py-3 px-4 text-left font-medium">
              S.no
            </th>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="py-3 px-4 text-left font-medium"
              >
                {column.label}
              </th>
            ))}
            <th scope="col" className="py-3 px-4 text-left font-medium">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {status === "loading" && (
            <tr>
              <td colSpan={columns.length + 3} className="py-4 px-4">
                <Skeleton count={10} height={40} />
              </td>
            </tr>
          )}
          {status === "failed" && (
            <tr>
              <td colSpan={columns.length + 3} className="py-4 px-4">
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
                <td className="py-3 px-4">{index + 1}</td>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-3 px-4">
                    {column.accessor
                      ? column.accessor === "serialNumber"
                        ? index + 1
                        : column.formatter
                        ? column.formatter(item[column.accessor], item)
                        : column.accessor === "description" ||
                          column.accessor === "content"
                        ? stripHtmlTags(item[column.accessor])
                        : item[column.accessor]
                      : ""}
                  </td>
                ))}
                <td className="py-3 px-4 flex space-x-4">
                  {onEdit && (
                    <div
                      className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-150"
                      onClick={() => onEdit(item._id)}
                      data-bs-toggle={model}
                      data-bs-target={databstarget}
                    >
                      <i className="bi bi-pencil-square text-lg"></i>
                    </div>
                  )}
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

export default CommanTable;
