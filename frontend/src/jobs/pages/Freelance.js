import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import FreelanceList from "../components/FreelanceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Freelance.css";
const Freelance = () => {
  const [loadedJobs, setLoadedJobs] = useState();
  const [filterList, setFilterList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/jobs`
        );
        setLoadedJobs(responseData.jobs);
        setFilterList(responseData.jobs);
      } catch (err) {}
    };
    fetchJobs();
  }, [sendRequest]);

  const jobApplyHandler = (applyJobId) => {
    setLoadedJobs((prevJobs) =>
      prevJobs.filter((job) => job.id !== applyJobId)
    );
  };

  function filterByCategory(category) {
    if (category === "All") {
      setFilterList(loadedJobs);
    } else {
      const filterSuc = [];
      const jobList = loadedJobs;
      for (let i = 0; i < jobList.length; i++) {
        for (let j = 0; j < jobList[i].categories.length; j++) {
          if (category === jobList[i].categories[j]) {
            const jobFilted = jobList[i];
            filterSuc.push(jobFilted);
          }
          setFilterList(filterSuc);
        }
      }
    }
  }

  const handleChange = (event) => {
    let eventList = event.target.value; //ดึงค่าที่รับมาใส่ตัวแปร
    setSearchList(eventList);
    console.log("searchList: " + searchList);
    let jobFilted = []; //สร้างตัวแปรมารับชุดข้อมูลที่กรองได้
    let jobList = loadedJobs; //สร้างตัวมาที่ดึงข้อมูลมาจากชุดข้อมูล loadedJobs
    if (eventList !== "") {
      //ถ้าค่าที่รับมานั้นไม่ว่าง (หรือก็คือมีอะไรอยู่ในช่องค้นหา)
      jobFilted = jobList.filter(
        (
          item //นำชุดข้อมูลที่มีอยู่ มากรอง แล้วไปแทนค่า
        ) =>
          item.title.toLowerCase().includes(eventList.toLowerCase()) ||
          item.description.toLowerCase().includes(eventList.toLowerCase()) ||
          item.companyName.toLowerCase().includes(eventList.toLowerCase()) ||
          item.wage.toString().includes(eventList.toLowerCase()) ||
          item.expDate.toString().includes(eventList.toLowerCase()) ||
          item.companyAddress.toLowerCase().includes(eventList.toLowerCase()) //โดยเช็คค่าที่มีอยู่ว่ามันมีค่าที่เหมือนใน .includes() หรือไม่
      );
      setFilterList(jobFilted); //นำชุดข้อมูลที่กรองได้ไปใส่ในชุดข้อมูลที่ทำหน้าที่แสดงค่า
    } else {
      setFilterList(jobList); //ถ้าไม่มีก็ให้แสดงชุดข้อมูลทั้งหมดที่มี
    }
  };

  return (
    <React.Fragment>
      <div>
        <div className="search">
          <input
            type="text" //ประเภทของการกรอก (ข้อความสั้น ๆ)
            placeholder="Search" //ตัวเทา ๆ ในช่องกรอก
            value={filterList.title} //แสดงค่าที่กรอกให้เห็น
            onChange={handleChange} //ถ้ามีการเปลี่ยนแปลงก็ให้มันไปรันคำสั่งนั้น
          />
        </div>
        <div className="jobtype">
          <Link to="" onClick={() => filterByCategory("Frontend")}>
            <span id="frontendbutton">Front-end</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("Backend")}>
            <span id="backendbutton">Back-end</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("Network")}>
            <span id="networkbutton">Network</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("Database")}>
            <span id="dbbutton">Database</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("UX&UI")}>
            <span id="uibutton">UX & UI</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("Other")}>
            <span id="otherbutton">Other</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("All")}>
            <span id="otherbutton">Reset</span>
          </Link>
        </div>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && loadedJobs && (
          <FreelanceList items={filterList} onApplyJob={jobApplyHandler} />
        )}
      </div>
    </React.Fragment>
  );
};

export default Freelance;
