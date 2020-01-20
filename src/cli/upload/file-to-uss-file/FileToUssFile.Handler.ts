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

import { IO } from "@zowe/imperative";
import { UssUtils } from "../../../api/UssUtils";
import { CoreUtils } from "../../../api/CoreUtils";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";

export default class UploadFileToUssFileHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const transferType = params.arguments.binary ? "binary" : "ascii";
        let content: Buffer = IO.readFileSync(params.arguments.file, undefined, params.arguments.binary);
        const uploadSource: string = "local file '" + params.arguments.file + "'";
        if (!params.arguments.binary) {
            // if we're not in binary mode, we need carriage returns to avoid errors
            content = Buffer.from(CoreUtils.addCarriageReturns(content.toString()));
        }
        const ussFile = UssUtils.normalizeUnixPath(params.arguments.ussFile);
        this.log.debug("Attempting to upload from local file '%s' to USS file '%s' in transfer mode '%s'",
            params.arguments.file, ussFile, transferType);

        await params.connection.uploadDataset(content, ussFile, transferType);

        const successMsg = params.response.console.log("Uploaded from %s to %s ", uploadSource, ussFile);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}

