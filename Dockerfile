FROM scratch

MAINTAINER "echocat" contact@echocat.org

ADD images/rootfs.tar.gz /

ENV PATH "/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin"

CMD ["bash","--login"]
