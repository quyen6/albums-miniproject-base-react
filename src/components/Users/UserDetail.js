import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { EyeOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";

import DetailLayout from "../../layout/DetailLayout";
import { UsersIcon } from "../../assets/Icons";

import classNames from "classnames/bind";
import styles from "./UserDetail.module.scss";
import { fetchDataAlbumByUserId } from "../../services/UserService";

const cx = classNames.bind(styles);

function UserDetail(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const [user] = useState(location.state?.user || null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data albums when have user data
  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      const getAlbumsByUserId = async () => {
        try {
          const res = await fetchDataAlbumByUserId(user.id);
          if (res && res.data) {
            setAlbums(res.data);
            setLoading(false);
          }
        } catch (error) {
          throw new Error("Failed to fetch albums for this user");
        }
      };
      getAlbumsByUserId();
    }
  }, [user]);

  const columns = [
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showAblumDetail(record)}
        >
          Show
        </Button>
      ),
    },
  ];
  const showAblumDetail = (album) => {
    navigate(`/albums/${album.id}`, {
      state: { user, album },
    });
  };
  return (
    <DetailLayout
      icon={<UsersIcon />}
      breadcrumbLink="/users"
      breadcrumbText="Users"
      breadcrumbCurrent="User Detail"
      backTitle="Show User"
      user={user}
    >
      <div className={cx("user-detail")}>
        <h4 className={cx("user-detail-header")}>Albums</h4>
        <div className={cx("user-detail-content")}>
          <Table
            columns={columns}
            dataSource={albums}
            rowKey="id"
            pagination={false}
            loading={loading}
          />
        </div>
      </div>
    </DetailLayout>
  );
}

export default UserDetail;
