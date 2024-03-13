CREATE DATABASE IF NOT EXISTS cleaningPlan;
USE cleaningPlan;

CREATE TABLE IF NOT EXISTS person(
    personId    varchar(36) PRIMARY KEY,
    prename     varchar(50),
    surname     varchar(50),
    active      boolean
);

CREATE TABLE IF NOT EXISTS tasks (
    taskId      varchar(36) PRIMARY KEY,
    taskName    varchar(50),
    active      boolean
);

CREATE TABLE IF NOT EXISTS iterations (
    iterationId     varchar(36) PRIMARY KEY,
    iterationName   varchar(50),
    startAt         date,
    endAt           date
);

CREATE TABLE IF NOT EXISTS iterationTask(
    iterationTaskId 	VARCHAR(36) PRIMARY KEY,
    taskId         	    varchar(36),
    iterationId     	varchar(36),
    doneOn				BOOLEAN,
    FOREIGN KEY (taskId) REFERENCES tasks(taskId),
    FOREIGN KEY (iterationId) REFERENCES iterations(iterationId)
);

CREATE TABLE IF NOT EXISTS personXIterationTask(
	personIterationTaskId 	VARCHAR(36) PRIMARY KEY,
	personId				VARCHAR(36),
	iterationTaskId			VARCHAR(36),
	FOREIGN KEY (personId) REFERENCES person(personId),
	FOREIGN KEY (iterationTaskId) REFERENCES iterationTask(iterationTaskId)
);