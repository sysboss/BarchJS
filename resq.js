var NR = require("node-resque"),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec;

var connectionDetails = {
  pkg:       'ioredis',
  host:      '127.0.0.1',
  password:  null,
  port:      6379,
  database:  0,
  namespace: 'BarchJS', 
  // looping: true, 
  // options: {password: 'abc'}, 
};

var jobs = {
  "add": {
    plugins: [ 'jobLock', 'retry' ],
    pluginOptions: {
      jobLock: {},
      retry: {
        retryLimit: 3,
        retryDelay: (1000 * 5),
      }
    },
    perform: function(a,b,callback){
      var answer = a + b;
      callback(null, answer);
    },
  },
  "subtract": {
    perform: function(a,b,callback){
      var answer = a - b;
      callback(null, answer);
    },
  },

    "backup": {
        perform: function (dev,callback) {
            exec('/var/www/NodeJs/testRun/longtest.sh', function(error, stdout, stderr) {
                callback(null, stdout);
            });
        }
    },
    "backupX": {
        perform: function (dev,callback) {
            console.log("SPAWN!");
            var child  = spawn('/var/www/NodeJs/testRun/longtest.sh'),
                stdout = '';

            child.stdout.setEncoding('utf8');
            child.stdout.on('data', function (data) {
                stdout += data;
            });

            child.on('close', function(code) {
                callback(null, stdout);
            });

            child.on('error', function(code) {
                callback(null, stdout);
            });
        }
    }
};

/*
var worker = new NR.worker({connection: connectionDetails, queues: ['math', 'otherQueue', 'backupQueue']}, jobs);
worker.connect(function(){
  worker.workerCleanup(); // optional: cleanup any previous improperly shutdown workers on this host 
  worker.start();
});

var scheduler = new NR.scheduler({connection: connectionDetails});
scheduler.connect(function(){
  scheduler.start();
});

// Events
worker.on('start',           function(){ console.log("worker started"); });
worker.on('end',             function(){ console.log("worker ended"); });
worker.on('cleaning_worker', function(worker, pid){ console.log("cleaning old worker " + worker); });
worker.on('job',             function(queue, job){ console.log("working job " + queue + " " + JSON.stringify(job)); });
worker.on('reEnqueue',       function(queue, job, plugin){ console.log("reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job)); });
worker.on('success',         function(queue, job, result){ console.log("job success " + queue + " " + JSON.stringify(job) + " >> " + result); });
worker.on('failure',         function(queue, job, failure){ console.log("job failure " + queue + " " + JSON.stringify(job) + " >> " + failure); });
worker.on('error',           function(queue, job, error){ console.log("error " + queue + " " + JSON.stringify(job) + " >> " + error); });
worker.on('pause',           function(){ console.log("worker paused"); });
 
scheduler.on('start',             function(){ console.log("scheduler started"); });
scheduler.on('end',               function(){ console.log("scheduler ended"); });
scheduler.on('master',            function(state){ console.log("scheduler became master"); });
scheduler.on('error',             function(error){ console.log("scheduler error >> " + error); });
scheduler.on('working_timestamp', function(timestamp){ console.log("scheduler working timestamp " + timestamp); });
scheduler.on('transferred_job',   function(timestamp, job){ console.log("scheduler enquing job " + timestamp + " >> " + JSON.stringify(job)); });
*/

var multiWorker = new NR.multiWorker({
  connection: connectionDetails,
  queues: ['math', 'otherQueue', 'backupQueue'],
  minTaskProcessors:   1,
  maxTaskProcessors:   2,
  checkTimeout:        1000,
  maxEventLoopDelay:   10,  
  toDisconnectProcessors: true,
}, jobs);

// Events
// normal worker emitters 
multiWorker.on('start',             function(workerId){                      console.log("worker["+workerId+"] started"); })
multiWorker.on('end',               function(workerId){                      console.log("worker["+workerId+"] ended"); })
multiWorker.on('cleaning_worker',   function(workerId, worker, pid){         console.log("cleaning old worker " + worker); })
multiWorker.on('job',               function(workerId, queue, job){          console.log("worker["+workerId+"] working job " + queue + " " + JSON.stringify(job)); })
multiWorker.on('reEnqueue',         function(workerId, queue, job, plugin){  console.log("worker["+workerId+"] reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job)); })
multiWorker.on('success',           function(workerId, queue, job, result){  console.log("worker["+workerId+"] job success " + queue + " " + JSON.stringify(job) + " >> " + result); })
multiWorker.on('failure',           function(workerId, queue, job, failure){ console.log("worker["+workerId+"] job failure " + queue + " " + JSON.stringify(job) + " >> " + failure); })
multiWorker.on('error',             function(workerId, queue, job, error){   console.log("worker["+workerId+"] error " + queue + " " + JSON.stringify(job) + " >> " + error); })
 
// multiWorker emitters 
multiWorker.on('internalError',     function(error){                         console.log(error); })
multiWorker.on('multiWorkerAction', function(verb, delay){                   console.log("*** checked for worker status: " + verb + " (event loop delay: " + delay + "ms)"); });
 
multiWorker.start();

// QUEUE
var queue = new NR.queue({connection: connectionDetails}, jobs);
queue.on('error', function(error){ console.log(error); });
queue.connect(function(){
  //queue.enqueue('math', "add", [1,2]);
  //queue.enqueue('math', "add", [1,2]);
  //queue.enqueue('math', "add", [2,3]);
  //queue.enqueueIn(3000, 'math', "subtract", [2,1]);
  //queue.enqueue('backupQueue', "backupX", "test");
  //queue.enqueue('backupQueue', "backupX", "test");
  //queue.enqueue('backupQueue', "backupX", "test");
  //queue.enqueue('backupQueue', "backupX", "test");
  //queue.enqueue('backupQueue', "backupX", "test");
  //queue.enqueue('math', "add", [2,3]);
});
