import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { Avatar } from "./ui/avatar";
import { FaRegCalendarAlt } from "react-icons/fa";
import usericon from '@/assets/images/user.png';
import { Link } from "react-router-dom";
import { AvatarImage } from "@radix-ui/react-avatar";
import moment from "moment";
import { RouteBlogDetails } from "@/helpers/RouteName";

const BlogCard = ({ props }) => {
  const user = useSelector((state) => state.user);

  return (
    <Link to={RouteBlogDetails(props?.category?.slug, props?.slug)}>
      <Card className="pt-5 hover:shadow-lg transition-all duration-200 w-[380px] min-h-[400px] flex flex-col">
        <CardContent className="flex flex-col overflow-hidden">
          {/* Author Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={props?.author?.avatar || usericon} />
              </Avatar>
              <span>{props.author.name}</span>
            </div>
            {props.author.role === "admin" && (
              <Badge variant="outline" className="bg-violet-500 text-white">
                Admin
              </Badge>
            )}
          </div>

          {/* Blog Image */}
          <div className="w-full h-48 overflow-hidden rounded-md mb-3 flex-shrink-0">
            <img
              src={props.featuredImage}
              alt={props.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Blog Content */}
          <div className="flex flex-col">
            <p className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <FaRegCalendarAlt />
              <span>{moment(props.createdAt).format("DD-MM-YYYY")}</span>
            </p>
            <h2
              className="text-xl font-bold overflow-hidden text-ellipsis"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.5rem',
                maxHeight: '3rem',
              }}
              title={props.title}
            >
              {props.title}
            </h2>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
