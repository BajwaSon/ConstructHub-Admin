/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import https from "https";
import http from "http";
import path from "path";

// Determine environment file
const isProd = process.argv.includes("--prod");
const envFile = isProd ? "./src/environments/environment.prod.js" : "./src/environments/environment.js";
// Import environment dynamically
import(envFile).then(({ environment }) => {
  const url = `${environment.baseUrl}${environment.routesUrl}`;
  const outputFile = path.join(__dirname, "dump", "default-routes.json");

  const protocols = { https, http };

  protocols[url.includes("https") ? "https" : "http"]
    .get(url, res => {
      let result: any = "";

      res.on("data", chunk => {
        result += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(result);
          if (jsonData?.status == "OK") {
            fs.mkdirSync(path.dirname(outputFile), { recursive: true });

            fs.writeFileSync(outputFile, `${JSON.stringify(jsonData.data, null, 2)}`, "utf8");
            console.debug(`Default routes from ${url}`);
          } else {
            throw new Error("API returned an error");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          throw error;
        }
      });
    })
    .on("error", err => {
      console.error("Error fetching data:", err);
      throw err;
    });
});
