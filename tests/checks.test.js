/**
 * Checker Script for mooc_git-entrega3_rebase2
 */


// IMPORTS
const should = require('chai').should();
const git = require('simple-git/promise');
const Utils = require("./utils");
const to = require("./to");
const path = require('path');
const fs = require('fs-extra');


// Parse input arguments
const args = JSON.parse(JSON.stringify(process.argv));
// Gets the student name from args[2]
if (!(args.length > 2)) {
    console.error("student name not found");
    process.exit(1);
}
const student = args[2];

// CONSTS
const REPO_NAME = 'tf_agenda';
const PATH_ASSIGNMENT = path.resolve(path.join(__dirname, "../"));
const REPO_URL = `https://github.com/${student}/${REPO_NAME}`;
const PATH_REPO = path.join(PATH_ASSIGNMENT, REPO_NAME);
const BRANCH_NAME = "corrected_tf_agenda";

// GLOBALS
let error_critical = null;
let output = null;
let commit_1 = null;
let commit_2 = null;
let commit_3 = null;
let mygit = git(PATH_ASSIGNMENT);

describe('mooc_git-entrega3_rebase2', function () {

    it("", async function () {
        this.name = "1. Looking for the master branch";
        this.score = 1;
        this.msg_ok = `Master branch found at ${REPO_URL}`;
        [_, _] = await to(fs.remove(PATH_REPO));
        [error_repo, _] = await to(mygit.clone(REPO_URL));
        if (error_repo) {
            this.msg_err = `Master branch not found at ${REPO_URL}.\n\t\tError: >>${error_repo}<<`;
            error_critical = this.msg_err;
        }
        await to(mygit.cwd(PATH_REPO));
        should.not.exist(error_repo);
    });

    it("", async function () {
        const expected = BRANCH_NAME;
        this.name = `2. Looking for branch ${BRANCH_NAME}`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            let output;
            this.msg_ok = `Found branch ${BRANCH_NAME}`;
            [error_branch, branches] = await to(mygit.branch());
            if (error_branch) {
                this.msg_err = `Error reading branches from ${REPO_URL}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            } else {
                output = branches.all;
            }
            const no_branch = !Utils.search(expected, output);
            if (no_branch){
                this.msg_err = `Branch ${BRANCH_NAME} not found`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    it("", async function () {
        const expected = 3;
        this.name = `3. Checking the number of commits in branch '${BRANCH_NAME}'`;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_log, log] = await to(mygit.log());
            if (error_log) {
                this.msg_err = `Error reading logs from ${REPO_URL}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            let output = log.all.length;
            if (output < expected) {
                this.msg_err = `The number of commits in branch '${BRANCH_NAME}' is not correct\n\t\t\tExpected: ${expected}\n\t\t\tFound: ${output}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            commit_1 = log.all[log.all.length - 1].hash.substring(0, 7);
            commit_2 = log.all[log.all.length - 2].hash.substring(0, 7);
            commit_3 = log.all[log.all.length - 3].hash.substring(0, 7);
            this.msg_ok = `The number of commits in branch ${BRANCH_NAME} is correct`;
            output.should.be.equal(expected);
        }
    });

    it("", async function () {
        const expected = /John:\s+913-677-899;/;
        this.name = `4. Looking for '${expected}' in final branch ${BRANCH_NAME} commit ${commit_1}`;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [err_show, output] = await to(mygit.show([commit_1]));
            this.msg_ok = `Found '${expected}' in final branch ${BRANCH_NAME} commit ${commit_1}`;
            this.msg_err = `'${expected}' not found in final branch ${BRANCH_NAME} commit ${commit_1}`;
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    it("", async function () {
        const expected = /Eva:\s+915-768-455;/;
        this.name = `5. Looking for '${expected}' in final branch ${BRANCH_NAME} commit ${commit_2}`;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [err_show, output] = await to(mygit.show([commit_2]));
            this.msg_ok = `Found '${expected}' in final branch ${BRANCH_NAME} commit ${commit_2} contents`;
            this.msg_err = `'${expected}' not found final ${BRANCH_NAME} commit ${commit_2} contents`;
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    it("", async function () {
        const expected = /Mary:\s+918-555-555;/;
        this.name = `6. Looking for '${expected}' in final branch ${BRANCH_NAME} commit ${commit_3}`;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [err_show, output] = await to(mygit.show([commit_3]));
            this.msg_ok = `Found '${expected}' in final branch ${BRANCH_NAME} commit ${commit_3} contents`;
            this.msg_err = `'${expected}' not found in final branch ${BRANCH_NAME} commit ${commit_3} contents`;
            Utils.search(expected, output).should.be.equal(true);
        }
    });

});
