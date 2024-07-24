import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { useLocation, Link } from "react-router-dom";

const TailoringDetail = () => {
  const location = useLocation();
  const { tailoring } = location.state || {};
  const [user, setUser] = useState([])

  if (!tailoring) {
    console.log("Tailoring data is not being passed correctly or not present");
    return null;
  }

  console.log(
    "tailoring from TOD " +
      tailoring.costumerAddress +
      "  " +
      tailoring.customerName
  );





  return (
    <div className=" items-center mt-5 mb-4 sm:flex flex-col justify-center  overflow-x-auto">
      {/* main Table */}

      <Table striped>
        <Table.Head>
          <Table.HeadCell>Customer Name</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>message</Table.HeadCell>
          <Table.HeadCell>Tailoring Status</Table.HeadCell>
          <Table.HeadCell>
            <span className="dark:text-green-300 text-pink-600">
              Tailoring Price
            </span>
          </Table.HeadCell>
          <Table.HeadCell>Completion Date</Table.HeadCell>
        
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {tailoring.customerName}
            </Table.Cell>
            <Table.Cell>{tailoring.costumerAddress}</Table.Cell>
            <Table.Cell>{tailoring.serT}</Table.Cell>
            <Table.Cell>{tailoring.status}</Table.Cell>
            <Table.Cell>
              <span className="dark:text-green-300 text-pink-600">
                {tailoring.tailoringPrice}
              </span>
            </Table.Cell>
            <Table.Cell>
              {tailoring.completion_date
                ? tailoring.completion_date
                : "Not Available"}
            </Table.Cell>
           
          </Table.Row>
        </Table.Body>
      </Table>
      <Table striped className="mt-10">
        <Table.Body className="divide-y">
          <Table.Row className="bg-white m`-3 dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap bg-gray-300 dark:bg-slate-600 font-medium text-gray-900 dark:text-white">
              TAILOR NAME
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap bg-gray-300 dark:bg-slate-600 font-medium text-gray-900 dark:text-gray-300">
              {tailoring?.tailorName || "Not Assign to Tailor now"}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      {/* Measurement table */}

      <div className="overflow-x-auto mb-20 m-3  mt-5">
        <h3 className="font-semibold text-center text-slate-500 dark:text-lime-100 mb-3">
          The customer Measurement date for tailoring.
        </h3>
        <Table striped>
  <Table.Body className="divide-y">
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Shirt Length'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.shirtLength}</Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Arm Length'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.armLenght || "N/A"}</Table.Cell>
    </Table.Row>

    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Ghera'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.ghera}</Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Thera'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.thera}</Table.Cell>
    </Table.Row>

    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Gala'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.gala}</Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Chati'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.chati}</Table.Cell>
    </Table.Row>

    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Qamar'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.qamar}</Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Side'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.side}</Table.Cell>
    </Table.Row>

    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Caf'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.caf}</Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Front'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.front}</Table.Cell>
    </Table.Row>

    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Calor'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.calor}</Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Shalwar'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.shalwar}</Table.Cell>
    </Table.Row>

    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {'Paincha'}
      </Table.Cell>
      <Table.Cell>{tailoring.measurementForm.paincha}</Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {''}
      </Table.Cell>
      <Table.Cell>{''}</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>

      </div>
    </div>
  );
};

export default TailoringDetail;
