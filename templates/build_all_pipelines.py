from pipelines.init_databag_sniffle_upload.main import main as main1
from pipelines.katib_solver.main import main as main2
from pipelines.ludwig_solver.main import main as main3
from pipelines.randomforest_titanic.main import main as main4

if __name__ == '__main__':
    main1()
    main2()
    main3()
    main4()
