import { RequestParamHandler } from "express";
import { Currency, Server } from "../types";
import { CurrencyDatabase as CurrencyDbApi } from "../databasesApi/CurrencyDatabase";
import { CurrencyConverter } from "../converters/CurrencyConverter";

const express = require("express");

const CurrencyRouter = express.Router();

CurrencyRouter.get(
  "/names",
  (req: RequestParamHandler, res: Server.ServerResponse) => {
    const dbInstance = new CurrencyDbApi();
    dbInstance
      .fetchLatestListFromDb()
      .then((currencyList: Currency.DatabaseList) => {
        const namesList: string[] = currencyList.exchangeRates.map(currency => {
          return currency.name;
        });
        res.end(JSON.stringify(namesList));
      })
      .catch(err => {
        res.status(500).send("Cannot retrieve list");
      });
  }
);

CurrencyRouter.post(
  "/convert",
  (req: Server.CurrencyRequest, res: Server.ServerResponse) => {
    const fromCurrency = req.body.from;
    const toCurrencyName = req.body.to;
    const dbInstance = new CurrencyDbApi();
    dbInstance
      .fetchLatestListFromDb()
      .then((currencyList: Currency.DatabaseList) => {
        const converter = new CurrencyConverter(
          currencyList.exchangeRates,
          fromCurrency,
          toCurrencyName
        );
        const converted: Currency.Quantity = converter.convert();
        res.end(JSON.stringify(converted));
      })
      .catch(err => {
        res.status(500).send("Cannot convert");
      });
  }
);

export { CurrencyRouter };
