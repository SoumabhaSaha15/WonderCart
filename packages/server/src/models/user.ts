// import mongoose from "@/configurations/db";

// const userSchema = new mongoose.Schema(

// import { defineAbility } from "@casl/ability";
// const ability = defineAbility((can) => can("read", "Post", { private: false }));
// interface Post {
//   title: string;
//   content: string;
//   published: boolean;
// }
// type PostDocument = ExtendedDocument<Post>;
// const PostSchema = new mongoose.Schema<PostDocument>(
//   {
//     title: String,
//     content: String,
//     published: Boolean,
//   },
//   { timestamps: true },
// );
// const PostModel = mongoose.model<PostDocument, PluginTypeExtender<Post>>("Post", PostSchema);
// PostModel.accessibleBy(ability);
