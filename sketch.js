let capture;
let posenet;
let singlePose, skeleton;
let actor_img;
let specs, smoke;
let tableContainer;

function setup() {
    createCanvas(800, 800);
    capture = createCapture(VIDEO)
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose', receivedPoses);

    actor_img = loadImage('images/shahrukh.png');
    specs = loadImage('images/spects.png');
    smoke = loadImage('images/cigar.png');

    createTable(); // Create the initial table
}

function receivedPoses(poses) {
    if (poses.length > 0) {
        singlePose = poses[0].pose;
        updateTable(singlePose); // Update the table with new pose data
        skeleton = poses[0].skeleton;
    }
}

function modelLoaded() {
    console.log('Model has loaded');
}

function createTable() {
    // Create a div container for the table
    tableContainer = createDiv();
    tableContainer.id('table-container');
    tableContainer.position(width, 0); // Position to the right of the canvas

    // Create the table within the container
    let table = createElement('table');
    table.parent(tableContainer);
    table.id('pose-table');
}

function updateTable(singlePose) {
    let poseTable = select('#pose-table');
    poseTable.html(''); // Clear the previous content
    let tableBody = createElement('tbody');
    tableBody.parent(poseTable);
    for (let i = 0; i < singlePose.keypoints.length; i++) {
        let keypoint = singlePose.keypoints[i];
        let label = keypoint.part;
        let x = keypoint.position.x.toFixed(2);
        let y = keypoint.position.y.toFixed(2);
        let row = createElement('tr');
        let labelCell = createElement('td', label);
        let coordinateCell = createElement('td', `(${x}, ${y})`);
        row.child(labelCell);
        row.child(coordinateCell);
        tableBody.child(row);
    }
}

function draw() {
    // Draw the video feed
    image(capture, 0, 0);
    fill(255, 0, 0);

    if (singlePose) {
        // Draw keypoints and skeleton
        for (let i = 0; i < singlePose.keypoints.length; i++) {
            const keypoint = singlePose.keypoints[i];
            if (keypoint.score > 0.2 && keypoint.position.x >= 0 && keypoint.position.x <= width && keypoint.position.y >= 0 && keypoint.position.y <= height) {
                // Draw only if the keypoint confidence score is above the threshold and within canvas bounds
                ellipse(keypoint.position.x, keypoint.position.y, 12);
            }
        }
        stroke(255, 255, 255);
        strokeWeight(5);
        for (let j = 0; j < skeleton.length; j++) {
            line(skeleton[j][0].position.x, skeleton[j][0].position.y, skeleton[j][1].position.x, skeleton[j][1].position.y)
        }
    }
}
