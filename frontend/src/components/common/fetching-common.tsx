import { FC } from "react";
import styles from "./fetching-info.module.scss";
import { Button } from ".";

type FetchingInfoProps = {
  isPending: null | boolean;
  error: null | string;
  refetch?: () => void;
};

export const FetchingInfo: FC<FetchingInfoProps> = ({
  isPending,
  error,
  refetch,
}) => {
  return (
    <div className={styles.fetchngInfoWrapper}>
      <div className={styles.content}>
        {!isPending ? (
          <div>{error ? <Error error={error} refetch={refetch} /> : null}</div>
        ) : (
          <div>{isPending ? <Loading /> : null}</div>
        )}
      </div>
    </div>
  );
};

export const Loading: FC = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.content}>
        <div className={styles.text}>Loading</div>
      </div>
    </div>
  );
};

type ErrorProps = { error: string; refetch?: () => void };

export const Error: FC<ErrorProps> = ({ error, refetch }) => {
  return (
    <div className={styles.error}>
      <div className={styles.content}>
        <div className={styles.text}>{error}</div>
        {refetch ? (
          <div className={styles.tryAgainWrapper}>
            <Button onClick={refetch} defaultButtonType="info">
              Try again
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
