import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Image, Spin } from "antd";

import classNames from "classnames/bind";
import styles from "./AlbumDetail.module.scss";
import { AlbumsIcon } from "../../assets/Icons";
import DetailLayout from "../../layout/DetailLayout";
import { fetchDataAlbumById } from "../../services/UserService";

const cx = classNames.bind(styles);

const AlbumDetail = () => {
  const location = useLocation();

  const [album, setAlbum] = useState(location.state?.album || null);
  const [user] = useState(location.state?.user || null);

  const [isImagesLoading, setIsImagesLoading] = useState(true);

  // Fetch album
  useEffect(() => {
    if (!album) {
      const getAlbumsByUserId = async () => {
        try {
          const res = await fetchDataAlbumById(album?.id);
          if (res && res.data) {
            setAlbum(res.data);
          }
        } catch (error) {
          throw new Error("Failed to fetch albums for this user");
        }
      };
      getAlbumsByUserId();
    }
  }, [album]);

  return (
    <DetailLayout
      icon={<AlbumsIcon />}
      breadcrumbLink="/albums?pageSize=20&current=1"
      breadcrumbText="Albums"
      breadcrumbCurrent={`Album`}
      backTitle="Show Album"
      user={user}
    >
      <div className={cx("album-detail")}>
        <h4 className={cx("album-detail-header")}>{album?.title}</h4>

        <div
          className={cx("album-detail-content")}
          style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
        >
          <Image.PreviewGroup>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {isImagesLoading && (
                <div
                  style={{ textAlign: "center", width: "100%", marginTop: 20 }}
                >
                  <Spin />
                </div>
              )}
              {Array.from({ length: 10 }).map((_, index) => {
                const imageUrl = `https://picsum.photos/id/${
                  +album.id * 10 + index
                }/600/600`;
                const thumbUrl = `https://picsum.photos/id/${
                  +album.id * 10 + index
                }/150/150`;

                return (
                  <Image
                    key={index}
                    width={150}
                    height={150}
                    style={{
                      objectFit: "cover",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    src={thumbUrl}
                    preview={{
                      src: imageUrl,
                    }}
                    alt={`Album image ${index + 1}`}
                    onLoad={() => {
                      if (isImagesLoading) setIsImagesLoading(false);
                    }}
                  />
                );
              })}
            </div>
          </Image.PreviewGroup>
        </div>
      </div>
    </DetailLayout>
  );
};

export default AlbumDetail;
