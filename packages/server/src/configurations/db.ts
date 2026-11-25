import mongoose from "mongoose";
import pagination from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { accessibleRecordsPlugin, AccessibleModel } from "@casl/mongoose";

mongoose.set("strictQuery", "throw");
mongoose.set("debug", process.env["NODE_ENV"] === "development");
mongoose.plugin(pagination);
mongoose.plugin(aggregatePaginate);
mongoose.plugin(accessibleRecordsPlugin);

export type ExtendedDocument<T> = T &
  mongoose.Document & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };
export type PluginTypeExtender<T> = mongoose.PaginateModel<ExtendedDocument<T>> &
  mongoose.AggregatePaginateModel<ExtendedDocument<T>> &
  AccessibleModel<ExtendedDocument<T>>;

export default mongoose;
