import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "1m", target: 100 }, // ramp up to 100 users
    { duration: "2m", target: 1000 }, // stay at 1000 users for 2 minutes
    { duration: "2m", target: 3000 }, // ramp up to 3000 users
    { duration: "3m", target: 3000 }, // stay at 3000 users for 3 minutes
    { duration: "1m", target: 0 }, // ramp down to 0 users
  ],
};

export default function () {
  // let res = http.get("http://localhost:3001/api/user/1");
  const url = "http://localhost:3001/api/auth/login";
  const payload = JSON.stringify({
    email: "test1@gmail.com",
    password: "test1111"
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "transaction time OK": (r) => r.timings.duration < 400, // response within mili seconds
  });

  sleep(1);
}
