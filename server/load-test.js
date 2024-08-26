import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 100 },   // ramp up to 100 users
    { duration: '2m', target: 1000 },  // stay at 1000 users for 2 minutes
    { duration: '2m', target: 3000 },  // ramp up to 3000 users
    { duration: '3m', target: 3000 },  // stay at 3000 users for 3 minutes
    { duration: '1m', target: 0 },     // ramp down to 0 users
  ],
};

export default function () {
//   let res = http.post('http://localhost:3001/api/auth/login', {
//     email: 'test1@gmail.com',
//     password: 'test1111',
//   });
let res = http.get("http://localhost:3001/api/user/1")

  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time OK': (r) => r.timings.duration < 2500,  // response within 2 seconds
  });

  sleep(1);
}
