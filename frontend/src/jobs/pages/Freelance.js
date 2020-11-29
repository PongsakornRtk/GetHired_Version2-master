import React, { useEffect, useState } from "react";

import FreelanceList from "../components/FreelanceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Freelance.css";
import _ from "lodash";
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
            console.log(filterSuc);
          }
        }
      }
      setFilterList(_.union(filterSuc));
    }
  }

  const handleSearchChange = (event) => {
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
        <div>
          <div className="jobtype">
            <button
              id="frontendbutton"
              onClick={() => filterByCategory("Frontend")}
            >
              <span>Front-end</span>
            </button>
            <button
              id="backendbutton"
              onClick={() => filterByCategory("Backend")}
            >
              <span>Back-end</span>
            </button>
            <button
              id="networkbutton"
              onClick={() => filterByCategory("Network")}
            >
              <span>Network</span>
            </button>
            <button id="dbbutton" onClick={() => filterByCategory("Database")}>
              <span>Database</span>
            </button>
            <button id="uibutton" onClick={() => filterByCategory("UX&UI")}>
              <span>UX & UI</span>
            </button>
            <button id="otherbutton" onClick={() => filterByCategory("Other")}>
              <span>Other</span>
            </button>
            <button id="allbutton" onClick={() => filterByCategory("All")}>
              <span>All Job</span>
            </button>
            <div className="searchbutton">
              <link
                rel="stylesheet"
                href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
                integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU"
                crossOrigin="anonymous"
              />
              <form className="searchbuttonform" action="">
                <input
                  type="search"
                  placeholder="Search"
                  value={filterList.value} //แสดงค่าที่กรอกให้เห็น
                  onChange={handleSearchChange}
                />
                <i className="fa fa-search"></i>
              </form>
            </div>
          </div>
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
