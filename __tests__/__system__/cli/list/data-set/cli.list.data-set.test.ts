/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { FTPConfig } from "../../../../../src/api/FTPConfig";
import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";
import { runCliScript } from "../../../../__src__/TestUtils";
import * as path from "path";

let dsname: string;
let user: string;
let connection: any;

let testEnvironment: ITestEnvironment;
describe("list data-set-classic ftp command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_list_dataset",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zosftp);
        user = testEnvironment.systemTestProperties.zosftp.user.trim().toUpperCase();


    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display list data set help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "list_ds_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to list the job data set from the test properties file", async () => {
        const expectedDS = testEnvironment.systemTestProperties.datasets.writablePDS.toUpperCase();
        const result = runCliScript(__dirname + "/__scripts__/command/command_list_data_set.sh", testEnvironment, [expectedDS]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain(expectedDS);
    });

    it("should give a syntax error if the data set pattern is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command/command_list_data_set.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("data set");
        expect(stderr).toContain("pattern");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
