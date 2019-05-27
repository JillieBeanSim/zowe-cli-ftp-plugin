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

import { ICommandDefinition } from "@brightside/imperative";
import { DownloadDataSetDefinition } from "./data-set/DataSet.definition";
import { DownloadUSSFileDefinition } from "./uss-file/UssFile.definition";
import { DownloadAllSpoolByJobidDefinition } from "./all-spool-by-jobid/AllSpoolByJobId.definition";
import { FTPConfig } from "../../api/FTPConfig";

const DownloadDefinition: ICommandDefinition = {
    name: "download", aliases: ["dl"],
    summary: "Download data set, job spool, and USS file content",
    description: "Download data set, job spool, and USS file content",
    type: "group",
    children: [DownloadAllSpoolByJobidDefinition, DownloadDataSetDefinition, DownloadUSSFileDefinition],
    passOn: [
        {
            property: "options",
            value: FTPConfig.FTP_CONNECTION_OPTIONS,
            merge: true,
            ignoreNodes: [
                {type: "group"}
            ]
        }
    ]
};

export = DownloadDefinition;
