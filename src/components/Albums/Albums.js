import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Table } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import usePaginationParams from "../../pagination/usePaginationParams";
import "./pagination.scss";
import { EditIcon } from "../../assets/Icons";
import { fetchDataAlbums, fetchDataUsers } from "../../services/UserService";

const columns = (usersMap, handleShowAlbum, navigate) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "User",
    dataIndex: "userId",
    key: "userId",
    render: (userId) => {
      //
      const user = usersMap[userId];
      const album = user.albums;

      const name = user?.name || "Unknown User";

      const avatar = user?.avatar;

      return (
        // Display user avatar and name
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            color: "#0958d9",
          }}
          onClick={() => {
            navigate(`/users/${userId}`, {
              state: { user, album },
            });
          }}
        >
          <img
            src={avatar}
            alt={name}
            style={{ width: 30, height: 30, borderRadius: "50%" }}
          />
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <div className="d-flex gap-2">
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleShowAlbum(record.id)}
        >
          Show
        </Button>

        <Button size="small" icon={<EditIcon />}>
          Edit
        </Button>
      </div>
    ),
  },
];

function Albums() {
  const [data, setData] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbumsAndUsers = async () => {
      try {
        setLoading(true);
        const [albumsRes, usersRes] = await Promise.all([
          fetchDataAlbums(),
          fetchDataUsers(),
        ]);
        const albums = albumsRes.data || [];
        const users = usersRes.data || [];
        const map = {};
        users.forEach((user) => {
          const userAlbums = albums.filter((album) => album.userId === user.id);

          map[user.id] = {
            ...user,
            albums: userAlbums,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name || "Unknown"
            )}&background=random`,
          };
        });

        setUsersMap(map);
        setData(albums);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumsAndUsers();
  }, []);

  // config show album when click Show button
  const handleShowAlbum = (albumId) => {
    const album = data.find((album) => album.id === albumId);
    if (!album) return;
    const user = usersMap[album.userId];
    if (!user) return;

    navigate(`/albums/${albumId}`, {
      state: {
        user,
        album,
      },
    });
  };

  // const handleEditTitleAlbum = (record) => {
  //   const newTitle = prompt("Enter new title for the album:", record.title);
  //   if (newTitle && newTitle.trim() !== "") {
  //     // Update the title in the local state
  //     setData((prevData) =>
  //       prevData.map((item) =>
  //         item.id === record.id ? { ...item, title: newTitle } : item
  //       )
  //     );
  //     // Optionally, you can also update the title on the server here
  //     fetch(`https://jsonplaceholder.typicode.com/albums/${record.id}`, {
  //       method: "PUT",
  //       body: JSON.stringify({ ...record, title: newTitle }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   }
  // };
  // pagination
  const { currentPage, pageSize, handleTableChange } = usePaginationParams();
  return (
    <Table
      columns={columns(
        usersMap,
        handleShowAlbum,

        navigate
      )}
      dataSource={data}
      style={{ minWidth: "100%" }}
      loading={loading}
      pagination={{
        pageSize: pageSize,
        current: currentPage,
        total: data.length,
        showSizeChanger: true,
        className: "custom-ant-pagination",
      }}
      onChange={handleTableChange}
      rowKey="id"
    />
  );
}

export default Albums;
